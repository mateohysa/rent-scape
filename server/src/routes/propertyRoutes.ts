import express from "express";
import { getProperties, getProperty, createProperty, updateProperty } from "../controllers/propertyController";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Tenant management routes
router.get("/", getProperties);
router.get("/:Id", getProperty);
router.post("/", authMiddleware(["manager"]), upload.array("photos"), createProperty);
router.put("/:Id", authMiddleware(["manager"]), upload.array("photos"), updateProperty); 

// add more routes later, group them logically:
// Property-related tenant routes
// router.get("/:cognitoId/properties", getTenantProperties);
// router.post("/:cognitoId/favorites", addPropertyToFavorites);

export default router;