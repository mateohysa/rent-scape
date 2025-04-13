import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const TenantRepository = {
  findByCognitoId: async (cognitoId: string) => {
    return prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true }
    });
  },
  
  create: async (data: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    return prisma.tenant.create({ data });
  },
  
  update: async (cognitoId: string, data: { name?: string, email?: string, phoneNumber?: string }) => {
    return prisma.tenant.update({
      where: { cognitoId },
      data
    });
  },
  
  findPropertiesByCognitoId: async (cognitoId: string) => {
    // Get the tenant with their favorite properties
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: {
          include: {
            location: true
          }
        }
      }
    });
    
    if (!tenant) {
      return [];
    }
    
    // Format each favorite property to include proper coordinates
    const propertiesWithFormattedLocation = await Promise.all(
      tenant.favorites.map(async (property) => {
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
  },
  
  addFavoriteProperty: async (cognitoId: string, propertyId: number) => {
    // First check if tenant exists and if property is already a favorite
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    if (!tenant) {
      return null;
    }

    // Check if property is already a favorite
    const existingFavorites = tenant.favorites || [];
    if (existingFavorites.some((fav) => fav.id === propertyId)) {
      return { alreadyExists: true, tenant };
    }

    // Add property to favorites
    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          connect: { id: propertyId },
        },
      },
      include: { favorites: true },
    });

    return { alreadyExists: false, tenant: updatedTenant };
  },
  
  removeFavoriteProperty: async (cognitoId: string, propertyId: number) => {
    // Remove property from favorites
    return prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          disconnect: { id: propertyId },
        },
      },
      include: { favorites: true },
    });
  }
};
