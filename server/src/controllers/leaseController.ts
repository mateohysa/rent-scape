import { Request, Response } from "express";
import * as leaseService from "../service/leaseService";

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await leaseService.getLeases();
    res.json(leases);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving leases: ${error.message}` });
  }
};

export const getLeasePayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payments = await leaseService.getLeasePayments(Number(id));
    res.json(payments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving lease payments: ${error.message}` });
  }
};
