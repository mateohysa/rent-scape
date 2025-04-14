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
exports.ManagerRepository = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const prisma = new client_1.PrismaClient();
exports.ManagerRepository = {
    findByCognitoId: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`[DEBUG] Searching for manager with cognitoId: ${cognitoId}`);
        try {
            const manager = yield prisma.manager.findUnique({
                where: { cognitoId }
            });
            console.log(`[DEBUG] Manager found: ${!!manager}`);
            if (!manager) {
                console.log(`[DEBUG] No manager found with cognitoId: ${cognitoId}`);
            }
            return manager;
        }
        catch (error) {
            console.error(`[ERROR] Error finding manager: ${error}`);
            throw error;
        }
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.manager.create({ data });
    }),
    update: (cognitoId, data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.manager.update({
            where: { cognitoId },
            data
        });
    }),
    findPropertiesByCognitoId: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        // First get all properties with their locations
        const properties = yield prisma.property.findMany({
            where: { managerCognitoId: cognitoId },
            include: {
                location: true,
            },
        });
        // Format each property to include proper coordinates
        const propertiesWithFormattedLocation = yield Promise.all(properties.map((property) => __awaiter(void 0, void 0, void 0, function* () {
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
    })
};
