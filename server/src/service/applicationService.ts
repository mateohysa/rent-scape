import * as applicationRepository from "../repositories/applicationRepository";

export const calculateNextPaymentDate = (startDate: Date): Date => {
  const today = new Date();
  const nextPaymentDate = new Date(startDate);
  while (nextPaymentDate <= today) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }
  return nextPaymentDate;
};

export const listApplications = async (userId?: string, userType?: string) => {
  try {
    let whereClause = {};

    if (userId && userType) {
      if (userType === "tenant") {
        whereClause = { tenantCognitoId: String(userId) };
      } else if (userType === "manager") {
        whereClause = {
          property: {
            managerCognitoId: String(userId),
          },
        };
      }
    }

    const applications = await applicationRepository.findApplications(whereClause);

    const formattedApplications = await Promise.all(
      applications.map(async (app) => {
        const lease = await applicationRepository.findLeaseByTenantAndProperty(
          app.tenantCognitoId,
          app.propertyId
        );

        return {
          ...app,
          property: {
            ...app.property,
            address: app.property.location.address,
          },
          manager: app.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        };
      })
    );

    return formattedApplications;
  } catch (error) {
    throw error;
  }
};

export const createApplication = async (applicationData: any) => {
  try {
    const { propertyId, tenantCognitoId } = applicationData;

    const property = await applicationRepository.findPropertyById(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const newApplication = await applicationRepository.createApplicationWithLease(
      applicationData,
      tenantCognitoId,
      propertyId
    );

    return newApplication;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (id: number, status: string) => {
  try {
    const application = await applicationRepository.findApplicationById(id);

    if (!application) {
      throw new Error("Application not found");
    }

    if (status === "Approved") {
      // Create a new lease
      const newLease = await applicationRepository.createLease(
        new Date(),
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        application.property.pricePerMonth,
        application.property.securityDeposit,
        application.propertyId,
        application.tenantCognitoId
      );

      // Update the property to connect the tenant
      await applicationRepository.updatePropertyTenant(
        application.propertyId,
        application.tenantCognitoId
      );

      // Update the application with the new lease ID
      await applicationRepository.updateApplication(id, { 
        status, 
        leaseId: newLease.id 
      });
    } else {
      // Update the application status (for both "Denied" and other statuses)
      await applicationRepository.updateApplication(id, { status });
    }

    // Get updated application details
    const updatedApplication = await applicationRepository.getUpdatedApplication(id);
    return updatedApplication;
  } catch (error) {
    throw error;
  }
};
