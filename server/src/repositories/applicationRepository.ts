import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ApplicationWhereClause {
  tenantCognitoId?: string;
  property?: {
    managerCognitoId?: string;
  };
}

export const findApplications = async (whereClause: ApplicationWhereClause = {}) => {
  return prisma.application.findMany({
    where: whereClause,
    include: {
      property: {
        include: {
          location: true,
          manager: true,
        },
      },
      tenant: true,
    },
  });
};

export const findLeaseByTenantAndProperty = async (tenantCognitoId: string, propertyId: number) => {
  return prisma.lease.findFirst({
    where: {
      tenant: {
        cognitoId: tenantCognitoId,
      },
      propertyId: propertyId,
    },
    orderBy: { startDate: "desc" },
  });
};

export const findPropertyById = async (propertyId: number) => {
  return prisma.property.findUnique({
    where: { id: propertyId },
    select: { pricePerMonth: true, securityDeposit: true },
  });
};

export const createApplicationWithLease = async (applicationData: any, tenantCognitoId: string, propertyId: number) => {
  return prisma.$transaction(async (prisma) => {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { pricePerMonth: true, securityDeposit: true },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Create lease first
    const lease = await prisma.lease.create({
      data: {
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        rent: property.pricePerMonth,
        deposit: property.securityDeposit,
        property: {
          connect: { id: propertyId },
        },
        tenant: {
          connect: { cognitoId: tenantCognitoId },
        },
      },
    });

    // Then create application with lease connection
    const application = await prisma.application.create({
      data: {
        applicationDate: new Date(applicationData.applicationDate),
        status: applicationData.status,
        name: applicationData.name,
        email: applicationData.email,
        phoneNumber: applicationData.phoneNumber,
        message: applicationData.message,
        property: {
          connect: { id: propertyId },
        },
        tenant: {
          connect: { cognitoId: tenantCognitoId },
        },
        lease: {
          connect: { id: lease.id },
        },
      },
      include: {
        property: true,
        tenant: true,
        lease: true,
      },
    });

    return application;
  });
};

export const findApplicationById = async (id: number) => {
  return prisma.application.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: true,
    },
  });
};

export const createLease = async (
  startDate: Date,
  endDate: Date,
  rent: number,
  deposit: number,
  propertyId: number,
  tenantCognitoId: string
) => {
  return prisma.lease.create({
    data: {
      startDate,
      endDate,
      rent,
      deposit,
      propertyId,
      tenantCognitoId,
    },
  });
};

export const updatePropertyTenant = async (propertyId: number, tenantCognitoId: string) => {
  return prisma.property.update({
    where: { id: propertyId },
    data: {
      tenants: {
        connect: { cognitoId: tenantCognitoId },
      },
    },
  });
};

export const updateApplication = async (id: number, data: any) => {
  return prisma.application.update({
    where: { id },
    data,
    include: {
      property: true,
      tenant: true,
      lease: true,
    },
  });
};

export const getUpdatedApplication = async (id: number) => {
  return prisma.application.findUnique({
    where: { id },
    include: {
      property: true,
      tenant: true,
      lease: true,
    },
  });
};
