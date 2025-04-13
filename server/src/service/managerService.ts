import { ManagerRepository } from "../repositories/managerRepository";

export const ManagerService = {
  getManager: async (cognitoId: string) => {
    return ManagerRepository.findByCognitoId(cognitoId);
  },
  
  createManager: async (managerData: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    // Any business logic goes here (validation, etc.)
    return ManagerRepository.create(managerData);
  },
  
  updateManager: async (cognitoId: string, managerData: { name?: string, email?: string, phoneNumber?: string }) => {
    return ManagerRepository.update(cognitoId, managerData);
  },
  
  getManagerProperties: async (cognitoId: string) => {
    // Get all properties managed by this manager
    return ManagerRepository.findPropertiesByCognitoId(cognitoId);
  }
};