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
  },
  
  getTenantProperties: async (cognitoId: string) => {
    // Get all favorite properties for this tenant
    return TenantRepository.findPropertiesByCognitoId(cognitoId);
  },
  
  addFavoriteProperty: async (cognitoId: string, propertyId: number) => {
    // Add a property to tenant's favorites
    return TenantRepository.addFavoriteProperty(cognitoId, propertyId);
  },
  
  removeFavoriteProperty: async (cognitoId: string, propertyId: number) => {
    // Remove a property from tenant's favorites
    return TenantRepository.removeFavoriteProperty(cognitoId, propertyId);
  }
};
