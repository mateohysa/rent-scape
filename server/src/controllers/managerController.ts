import { Request, Response } from "express";
import { ManagerService} from "../service/managerService";

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        const manager = await ManagerService.getManager(cognitoId);
        if(manager){
            res.json(manager);
        }
        else{
            res.status(404).json({message: "Manager not found"});
        }
        
        
    }catch(error:any){
        res.status(500).json({message: "Error retrieving manager", error: error.message});
    }
    
}

export const createManager = async (req: Request, res: Response): Promise<void> => {
    try{
        const manager = await ManagerService.createManager(req.body);
        res.status(201).json(manager);
    }catch(error:any){
        res.status(500).json({message: "Error creating manager", error: error.message});
    }
}

export const updateManager = async (req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        const manager = await ManagerService.updateManager(cognitoId, req.body);
        res.json(manager);
    }catch(error:any){
        res.status(500).json({message: "Error updating manager", error: error.message});
    }
}