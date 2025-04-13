import { PropertyRepository } from "../repositories/propertyRepository";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import { Express } from "express";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-east-1",
});

export const PropertyService = {
    getProperties: async (filters: any = {}) => {
        return PropertyRepository.findAll(filters);
    },
    getProperty: async (Id: string) => {
        return PropertyRepository.findById(Id);
    },
    createProperty: async (propertyData: any, files: Express.Multer.File[] = []) => {
        // Upload photos to S3 and get URLs
        const photoUrls = await Promise.all(
            files.map(async (file) => {
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: `properties/${Date.now()}-${file.originalname}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                };

                const uploadResult = await new Upload({
                    client: s3Client,
                    params: uploadParams,
                }).done();

                return uploadResult.Location;
            })
        );

        // Get coordinates from address data using geocoding
        const { address, city, country, postalCode } = propertyData.location;
        const coordinates = await PropertyService.geocodeAddress(
            address, 
            city, 
            country, 
            postalCode
        );

        // Add coordinates and photo URLs to property data
        const enrichedPropertyData = {
            ...propertyData,
            photoUrls,
            location: {
                ...propertyData.location,
                coordinates
            }
        };

        return PropertyRepository.create(enrichedPropertyData);
    },
    updateProperty: async (Id: string, propertyData: any, files: Express.Multer.File[] = []) => {
        let updateData = { ...propertyData };
        
        // If files are provided, upload to S3 and add URLs
        if (files && files.length > 0) {
            const photoUrls = await Promise.all(
                files.map(async (file) => {
                    const uploadParams = {
                        Bucket: process.env.S3_BUCKET_NAME!,
                        Key: `properties/${Date.now()}-${file.originalname}`,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    };

                    const uploadResult = await new Upload({
                        client: s3Client,
                        params: uploadParams,
                    }).done();

                    return uploadResult.Location;
                })
            );
            
            updateData.photoUrls = photoUrls;
        }
        
        // If location data is provided, try to geocode
        if (propertyData.location && Object.keys(propertyData.location).length > 0) {
            const { address, city, country, postalCode } = propertyData.location;
            
            // Only geocode if we have enough address data
            if (address && city) {
                const coordinates = await PropertyService.geocodeAddress(
                    address, 
                    city, 
                    country, 
                    postalCode
                );
                
                // Add coordinates to location data
                updateData.location = {
                    ...updateData.location,
                    coordinates
                };
            }
        }
        
        return PropertyRepository.update(Id, updateData);
    },
    // Helper method for geocoding addresses
    geocodeAddress: async (
        address: string, 
        city: string, 
        country: string, 
        postalCode: string
    ) => {
        try {
            const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
                {
                    street: address,
                    city,
                    country,
                    postalcode: postalCode,
                    format: "json",
                    limit: "1",
                }
            ).toString()}`;
            
            const geocodingResponse = await axios.get(geocodingUrl, {
                headers: {
                    "User-Agent": "RealEstate (justsomeemail@gmail.com)",
                },
            });
            
            if (geocodingResponse.data && geocodingResponse.data[0]) {
                return {
                    longitude: parseFloat(geocodingResponse.data[0].lon),
                    latitude: parseFloat(geocodingResponse.data[0].lat)
                };
            }
            
            // Default coordinates if geocoding fails
            return { longitude: 0, latitude: 0 };
        } catch (error) {
            console.error("Geocoding error:", error);
            return { longitude: 0, latitude: 0 };
        }
    }
}       