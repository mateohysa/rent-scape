import express from "express";
import { getTenant, createTenant, updateTenant, getTenantProperties, addFavoriteProperty, removeFavoriteProperty } from "../controllers/tenantController";

const router = express.Router();

// Tenant management routes
router.get("/:cognitoId", getTenant);
router.post("/", createTenant);
router.put("/:cognitoId", updateTenant);
router.get("/:cognitoId/properties", getTenantProperties);
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);


export default router;