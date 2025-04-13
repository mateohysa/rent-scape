import express from "express";
import { getTenant, createTenant, updateTenant, getTenantProperties } from "../controllers/tenantController";

const router = express.Router();

// Tenant management routes
router.get("/:cognitoId", getTenant);
router.post("/", createTenant);
router.put("/:cognitoId", updateTenant);
router.get("/:cognitoId/properties", getTenantProperties);
// If you add more routes later, group them logically:
// Property-related tenant routes
// router.get("/:cognitoId/properties", getTenantProperties);
// router.post("/:cognitoId/favorites", addPropertyToFavorites);

export default router;