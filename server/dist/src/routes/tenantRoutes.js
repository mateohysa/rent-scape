"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenantController_1 = require("../controllers/tenantController");
const router = express_1.default.Router();
// Tenant management routes
router.get("/:cognitoId", tenantController_1.getTenant);
router.post("/", tenantController_1.createTenant);
router.put("/:cognitoId", tenantController_1.updateTenant);
router.get("/:cognitoId/properties", tenantController_1.getTenantProperties);
router.post("/:cognitoId/favorites/:propertyId", tenantController_1.addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", tenantController_1.removeFavoriteProperty);
exports.default = router;
