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
exports.TenantRepository = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const prisma = new client_1.PrismaClient();
exports.TenantRepository = {
    findByCognitoId: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.tenant.findUnique({
            where: { cognitoId },
            include: { favorites: true }
        });
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.tenant.create({ data });
    }),
    update: (cognitoId, data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.tenant.update({
            where: { cognitoId },
            data
        });
    }),
    findPropertiesByCognitoId: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        // Get the tenant with their favorite properties
        const tenant = yield prisma.tenant.findUnique({
            where: { cognitoId },
            include: {
                favorites: {
                    include: {
                        location: true
                    }
                }
            }
        });
        if (!tenant) {
            return [];
        }
        // Format each favorite property to include proper coordinates
        const propertiesWithFormattedLocation = yield Promise.all(tenant.favorites.map((property) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const coordinates = yield prisma.$queryRaw `
          SELECT ST_AsText(coordinates) as coordinates 
          FROM "Location" 
          WHERE id = ${property.location.id}
        `;
            const geoJSON = (0, wkt_1.wktToGeoJSON)(((_a = coordinates[0]) === null || _a === void 0 ? void 0 : _a.coordinates) || "");
            const longitude = geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];
            return Object.assign(Object.assign({}, property), { location: Object.assign(Object.assign({}, property.location), { coordinates: {
                        longitude,
                        latitude,
                    } }) });
        })));
        return propertiesWithFormattedLocation;
    }),
    addFavoriteProperty: (cognitoId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        // First check if tenant exists and if property is already a favorite
        const tenant = yield prisma.tenant.findUnique({
            where: { cognitoId },
            include: { favorites: true },
        });
        if (!tenant) {
            return null;
        }
        // Check if property is already a favorite
        const existingFavorites = tenant.favorites || [];
        if (existingFavorites.some((fav) => fav.id === propertyId)) {
            return { alreadyExists: true, tenant };
        }
        // Add property to favorites
        const updatedTenant = yield prisma.tenant.update({
            where: { cognitoId },
            data: {
                favorites: {
                    connect: { id: propertyId },
                },
            },
            include: { favorites: true },
        });
        return { alreadyExists: false, tenant: updatedTenant };
    }),
    removeFavoriteProperty: (cognitoId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove property from favorites
        return prisma.tenant.update({
            where: { cognitoId },
            data: {
                favorites: {
                    disconnect: { id: propertyId },
                },
            },
            include: { favorites: true },
        });
    })
};
