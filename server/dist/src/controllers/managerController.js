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
exports.getManagerProperties = exports.updateManager = exports.createManager = exports.getManager = void 0;
const managerService_1 = require("../service/managerService");
const getManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const manager = yield managerService_1.ManagerService.getManager(cognitoId);
        if (manager) {
            res.json(manager);
        }
        else {
            res.status(404).json({ message: "Manager not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving manager", error: error.message });
    }
});
exports.getManager = getManager;
const createManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manager = yield managerService_1.ManagerService.createManager(req.body);
        res.status(201).json(manager);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating manager", error: error.message });
    }
});
exports.createManager = createManager;
const updateManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const manager = yield managerService_1.ManagerService.updateManager(cognitoId, req.body);
        res.json(manager);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating manager", error: error.message });
    }
});
exports.updateManager = updateManager;
const getManagerProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cognitoId } = req.params;
        const properties = yield managerService_1.ManagerService.getManagerProperties(cognitoId);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({
            message: `Error retrieving manager properties: ${error.message}`
        });
    }
});
exports.getManagerProperties = getManagerProperties;
