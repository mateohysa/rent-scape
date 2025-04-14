import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const ManagerRepository = {
  findByCognitoId: async (cognitoId: string) => {
    console.log(`[DEBUG] Searching for manager with cognitoId: ${cognitoId}`);
    try {
      const manager = await prisma.manager.findUnique({
        where: { cognitoId }
      });
      console.log(`[DEBUG] Manager found: ${!!manager}`);
      if (!manager) {
        console.log(`[DEBUG] No manager found with cognitoId: ${cognitoId}`);
      }
      return manager;
    } catch (error) {
      console.error(`[ERROR] Error finding manager: ${error}`);
      throw error;
    }
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
