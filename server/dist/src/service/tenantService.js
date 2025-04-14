"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const tenantRepository_1 = require("../repositories/tenantRepository");
exports.TenantService = {
    getTenant: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        return tenantRepository_1.TenantRepository.findByCognitoId(cognitoId);
    }),
    createTenant: (tenantData) => __awaiter(void 0, void 0, void 0, function* () {
        // Any business logic goes here (validation, etc.)
        return tenantRepository_1.TenantRepository.create(tenantData);
    }),
    updateTenant: (cognitoId, tenantData) => __awaiter(void 0, void 0, void 0, function* () {
        return tenantRepository_1.TenantRepository.update(cognitoId, tenantData);
    }),
    getTenantProperties: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        // Get all favorite properties for this tenant
        return tenantRepository_1.TenantRepository.findPropertiesByCognitoId(cognitoId);
    }),
    addFavoriteProperty: (cognitoId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        // Add a property to tenant's favorites
        return tenantRepository_1.TenantRepository.addFavoriteProperty(cognitoId, propertyId);
    }),
    removeFavoriteProperty: (cognitoId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove a property from tenant's favorites
        return tenantRepository_1.TenantRepository.removeFavoriteProperty(cognitoId, propertyId);
    })
};
