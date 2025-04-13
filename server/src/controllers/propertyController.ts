import { Request, Response } from "express";
import { PropertyService } from "../service/propertyService";

export const getProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const properties = await PropertyService.getProperties(req.query);
        res.json(properties);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving properties", error: error.message });
    }
}

export const getProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { Id } = req.params;
        const property = await PropertyService.getProperty(Id);
        
        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }
        
        res.json(property);
    } catch (error: any) {
        res.status(500).json({ message: "Error retrieving property", error: error.message });
    }
}

export const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        
        const {
            address,
            city,
            state,
            country,
            postalCode,
            managerCognitoId,
            ...propertyData
        } = req.body;
        
        // Prepare location data
        const locationData = {
            address,
            city,
            state,
            country,
            postalCode
        };
        
        // Convert data types
        const formattedData = {
            ...propertyData,
            managerCognitoId,
            amenities: typeof propertyData.amenities === "string"
                ? propertyData.amenities.split(",")
                : [],
            highlights: typeof propertyData.highlights === "string"
                ? propertyData.highlights.split(",")
                : [],
            isPetsAllowed: propertyData.isPetsAllowed === "true",
            isParkingIncluded: propertyData.isParkingIncluded === "true",
            pricePerMonth: parseFloat(propertyData.pricePerMonth),
            securityDeposit: parseFloat(propertyData.securityDeposit),
            applicationFee: parseFloat(propertyData.applicationFee),
            beds: parseInt(propertyData.beds),
            baths: parseFloat(propertyData.baths),
            squareFeet: parseInt(propertyData.squareFeet),
            location: locationData
        };
        
        const property = await PropertyService.createProperty(formattedData, files);
        res.status(201).json(property);
    } catch (error: any) {
        res.status(500).json({ message: "Error creating property", error: error.message });
    }
}

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { Id } = req.params;
        const files = req.files as Express.Multer.File[];
        
        const {
            address,
            city,
            state,
            country,
            postalCode,
            managerCognitoId,
            ...propertyData
        } = req.body;
        
        // Prepare location data if any fields provided
        const locationData: any = {};
        if (address) locationData.address = address;
        if (city) locationData.city = city;
        if (state) locationData.state = state;
        if (country) locationData.country = country;
        if (postalCode) locationData.postalCode = postalCode;
        
        // Convert data types for any provided fields
        const formattedData: any = { ...propertyData };
        if (propertyData.managerCognitoId) formattedData.managerCognitoId = managerCognitoId;
        if (propertyData.amenities) {
            formattedData.amenities = typeof propertyData.amenities === "string"
                ? propertyData.amenities.split(",")
                : [];
        }
        if (propertyData.highlights) {
            formattedData.highlights = typeof propertyData.highlights === "string"
                ? propertyData.highlights.split(",")
                : [];
        }
        if ('isPetsAllowed' in propertyData) formattedData.isPetsAllowed = propertyData.isPetsAllowed === "true";
        if ('isParkingIncluded' in propertyData) formattedData.isParkingIncluded = propertyData.isParkingIncluded === "true";
        if (propertyData.pricePerMonth) formattedData.pricePerMonth = parseFloat(propertyData.pricePerMonth);
        if (propertyData.securityDeposit) formattedData.securityDeposit = parseFloat(propertyData.securityDeposit);
        if (propertyData.applicationFee) formattedData.applicationFee = parseFloat(propertyData.applicationFee);
        if (propertyData.beds) formattedData.beds = parseInt(propertyData.beds);
        if (propertyData.baths) formattedData.baths = parseFloat(propertyData.baths);
        if (propertyData.squareFeet) formattedData.squareFeet = parseInt(propertyData.squareFeet);
        
        // Only add location field if any location data exists
        if (Object.keys(locationData).length > 0) {
            formattedData.location = locationData;
        }
        
        const property = await PropertyService.updateProperty(Id, formattedData, files);
        
        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }
        
        res.json(property);
    } catch (error: any) {
        res.status(500).json({ message: "Error updating property", error: error.message });
    }
}