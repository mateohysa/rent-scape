import express from "express";
import { getManager, createManager } from "../controllers/managerController";

const router = express.Router();

// Tenant management routes
router.get("/:cognitoId", getManager);
router.post("/", createManager);

// add more routes later, group them logically:
// Property-related tenant routes
// router.get("/:cognitoId/properties", getTenantProperties);
// router.post("/:cognitoId/favorites", addPropertyToFavorites);

export default router;