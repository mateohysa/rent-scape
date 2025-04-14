import { Request, Response } from "express";
import { ManagerService} from "../service/managerService";

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        console.log(`[DEBUG] Controller: getManager request for cognitoId: ${cognitoId}`);
        
        const manager = await ManagerService.getManager(cognitoId);
        console.log(`[DEBUG] Controller: Manager service returned: ${!!manager}`);
        
        if(manager){
            res.json(manager);
        }
        else{
            console.log(`[DEBUG] Controller: No manager found, returning 404`);
            res.status(404).json({message: "Manager not found"});
        }
        
        
    }catch(error:any){
        console.error(`[ERROR] Controller: Error retrieving manager: ${error.message}`);
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

export const getManagerProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;
        const properties = await ManagerService.getManagerProperties(cognitoId);
        res.json(properties);
    } catch (error: any) {
        res.status(500).json({ 
            message: `Error retrieving manager properties: ${error.message}` 
        });
    }
}