import * as leaseRepository from "../repositories/leaseRepository";

export const getLeases = async () => {
  try {
    return await leaseRepository.findAllLeases();
  } catch (error) {
    throw error;
  }
};

export const getLeasePayments = async (leaseId: number) => {
  try {
    return await leaseRepository.findLeasePayments(leaseId);
  } catch (error) {
    throw error;
  }
};
