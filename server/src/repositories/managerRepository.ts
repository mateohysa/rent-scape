import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const ManagerRepository = {
  findByCognitoId: async (cognitoId: string) => {
    return prisma.manager.findUnique({
      where: { cognitoId }
    });
  },
  
  create: async (data: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    return prisma.manager.create({ data });
  },
  
  update: async (cognitoId: string, data: { name?: string, email?: string, phoneNumber?: string }) => {
    return prisma.manager.update({
      where: { cognitoId },
      data
    });
  },
  
  findPropertiesByCognitoId: async (cognitoId: string) => {
    // First get all properties with their locations
    const properties = await prisma.property.findMany({
      where: { managerCognitoId: cognitoId },
      include: {
        location: true,
      },
    });

    // Format each property to include proper coordinates
    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
          SELECT ST_AsText(coordinates) as coordinates 
          FROM "Location" 
          WHERE id = ${property.location.id}
        `;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    return propertiesWithFormattedLocation;
  }
};
