import express from "express";
import { getTenant, createTenant, updateTenant } from "../controllers/tenantController";

const router = express.Router();

// Tenant management routes
router.get("/:cognitoId", getTenant);
router.post("/", createTenant);
router.put("/:cognitoId", updateTenant);
// If you add more routes later, group them logically:
// Property-related tenant routes
// router.get("/:cognitoId/properties", getTenantProperties);
// router.post("/:cognitoId/favorites", addPropertyToFavorites);

export default router;