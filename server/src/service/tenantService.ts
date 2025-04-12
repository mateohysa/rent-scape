import { TenantRepository } from "../repositories/tenantRepository";

export const TenantService = {
  getTenant: async (cognitoId: string) => {
    return TenantRepository.findByCognitoId(cognitoId);
  },
  
  createTenant: async (tenantData: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    // Any business logic goes here (validation, etc.)
    return TenantRepository.create(tenantData);
  },

  updateTenant: async (cognitoId: string, tenantData: { name: string, email: string, phoneNumber: string }) => {
    return TenantRepository.update(cognitoId, tenantData);
  }
};
