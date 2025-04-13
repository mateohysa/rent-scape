import { Request, Response } from "express";
import { TenantService } from "../service/tenantService";

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        const tenant = await TenantService.getTenant(cognitoId);
        if(tenant){
            res.json(tenant);
        }
        else{
            res.status(404).json({message: "Tenant not found"});
        }
        
        
    }catch(error:any){
        res.status(500).json({message: "Error retrieving tenant", error: error.message});
    }
    
}

export const createTenant = async (req: Request, res: Response): Promise<void> => {
    try{
        const tenant = await TenantService.createTenant(req.body);
        res.status(201).json(tenant);
    }catch(error:any){
        res.status(500).json({message: "Error creating tenant", error: error.message});
    }
}

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        const tenant = await TenantService.updateTenant(cognitoId, req.body);
        res.json(tenant);
    }catch(error:any){
        res.status(500).json({message: "Error updating tenant", error: error.message});
    }
}

export const getTenantProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId } = req.params;
        const properties = await TenantService.getTenantProperties(cognitoId);
        res.json(properties);
    } catch (error: any) {
        res.status(500).json({ 
            message: `Error retrieving tenant properties: ${error.message}` 
        });
    }
}

export const addFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId, propertyId } = req.params;
        
        const result = await TenantService.addFavoriteProperty(cognitoId, Number(propertyId));
        
        if (!result) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }
        
        if (result.alreadyExists) {
            res.status(409).json({ message: "Property already added as favorite" });
            return;
        }
        
        res.json(result.tenant);
    } catch (error: any) {
        res.status(500).json({ 
            message: `Error adding favorite property: ${error.message}` 
        });
    }
}

export const removeFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId, propertyId } = req.params;
        
        const updatedTenant = await TenantService.removeFavoriteProperty(cognitoId, Number(propertyId));
        
        if (!updatedTenant) {
            res.status(404).json({ message: "Tenant not found" });
            return;
        }
        
        res.json(updatedTenant);
    } catch (error: any) {
        res.status(500).json({ 
            message: `Error removing favorite property: ${error.message}` 
        });
    }
}