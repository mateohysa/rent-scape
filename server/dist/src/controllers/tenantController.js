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
exports.removeFavoriteProperty = exports.addFavoriteProperty = exports.getTenantProperties = exports.updateTenant = exports.createTenant = exports.getTenant = void 0;
const tenantService_1 = require("../service/tenantService");
const getTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const tenant = yield tenantService_1.TenantService.getTenant(cognitoId);
        if (tenant) {
            res.json(tenant);
        }
        else {
            res.status(404).json({ message: "Tenant not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving tenant", error: error.message });
    }
});
exports.getTenant = getTenant;
const createTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tenant = yield tenantService_1.TenantService.createTenant(req.body);
        res.status(201).json(tenant);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating tenant", error: error.message });
    }
});
exports.createTenant = createTenant;
const updateTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const tenant = yield tenantService_1.TenantService.updateTenant(cognitoId, req.body);
        res.json(tenant);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating tenant", error: error.message });
    }
});
exports.updateTenant = updateTenant;
const getTenantProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const properties = yield tenantService_1.TenantService.getTenantProperties(cognitoId);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({
            message: `Error retrieving tenant properties: ${error.message}`
        });
    }
});
exports.getTenantProperties = getTenantProperties;
const addFavoriteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, propertyId } = req.params;
        const result = yield tenantService_1.TenantService.addFavoriteProperty(cognitoId, Number(propertyId));
        if (!result) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }
        if (result.alreadyExists) {
            res.status(409).json({ message: "Property already added as favorite" });
            return;
        }
        res.json(result.tenant);
    }
    catch (error) {
        res.status(500).json({
            message: `Error adding favorite property: ${error.message}`
        });
    }
});
exports.addFavoriteProperty = addFavoriteProperty;
const removeFavoriteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId, propertyId } = req.params;
        const updatedTenant = yield tenantService_1.TenantService.removeFavoriteProperty(cognitoId, Number(propertyId));
        if (!updatedTenant) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }
        res.json(updatedTenant);
    }
    catch (error) {
        res.status(500).json({
            message: `Error removing favorite property: ${error.message}`
        });
    }
});
exports.removeFavoriteProperty = removeFavoriteProperty;
