import { ManagerRepository } from "../repositories/managerRepository";

export const ManagerService = {
  getManager: async (cognitoId: string) => {
    return ManagerRepository.findByCognitoId(cognitoId);
  },
  
createManager: async (managerData: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    // Any business logic goes here (validation, etc.)
    return ManagerRepository.create(managerData);
  }
};