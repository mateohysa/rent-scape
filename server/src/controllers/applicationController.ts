import { Request, Response } from "express";
import * as applicationService from "../service/applicationService";

export const listApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, userType } = req.query;
    
    const applications = await applicationService.listApplications(
      userId as string,
      userType as string
    );
    
    res.json(applications);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving applications: ${error.message}` });
  }
};

export const createApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;

    const applicationData = {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    };

    const newApplication = await applicationService.createApplication(applicationData);
    res.status(201).json(newApplication);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating application: ${error.message}` });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("status:", status);

    const updatedApplication = await applicationService.updateApplicationStatus(
      Number(id),
      status
    );
    
    res.json(updatedApplication);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating application status: ${error.message}` });
  }
};
