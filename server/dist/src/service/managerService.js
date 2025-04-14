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
exports.ManagerService = void 0;
const managerRepository_1 = require("../repositories/managerRepository");
exports.ManagerService = {
    getManager: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        return managerRepository_1.ManagerRepository.findByCognitoId(cognitoId);
    }),
    createManager: (managerData) => __awaiter(void 0, void 0, void 0, function* () {
        // Any business logic goes here (validation, etc.)
        return managerRepository_1.ManagerRepository.create(managerData);
    }),
    updateManager: (cognitoId, managerData) => __awaiter(void 0, void 0, void 0, function* () {
        return managerRepository_1.ManagerRepository.update(cognitoId, managerData);
    }),
    getManagerProperties: (cognitoId) => __awaiter(void 0, void 0, void 0, function* () {
        // Get all properties managed by this manager
        return managerRepository_1.ManagerRepository.findPropertiesByCognitoId(cognitoId);
    })
};
