import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const PropertyRepository = {
  findAll: async (filters: any = {}) => {
    const {
      favouriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareMetersMin,
      squareMetersMax,
      amenities,
      availableFrom,
      latitude,
      longitude
    } = filters;

    let whereConditions: Prisma.Sql[] = [];

    if (favouriteIds) {
      const favouriteIdsArray = favouriteIds.split(",").map(Number);
      whereConditions.push(
        Prisma.sql`p.id IN (${Prisma.join(favouriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p.pricePerMonth >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p.pricePerMonth <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(
        Prisma.sql`p.beds >= ${Number(beds)}`
      );
    }

    if (baths && baths !== "any") {
      whereConditions.push(
        Prisma.sql`p.baths >= ${Number(baths)}`
      );
    }

    if (squareMetersMin) {
      whereConditions.push(
        Prisma.sql`p.squareMeters >= ${Number(squareMetersMin)}`
      );
    }

    if (squareMetersMax) {
      whereConditions.push(
        Prisma.sql`p.squareMeters <= ${Number(squareMetersMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p.propertyType = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      whereConditions.push(
        Prisma.sql`p.amenities @> ${Prisma.join(amenitiesArray)}`
      );
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate = typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
    }

    const query = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    return prisma.$queryRaw(query);
  },

  findById: async (id: string) => {
    const property = await prisma.property.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        location: true,
        manager: true
      }
    });

    if (!property) return null;

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
          latitude
        }
      }
    };
  },

  create: async (propertyData: any) => {
    // Implement transaction for creating property with location using raw SQL
    return prisma.$transaction(async (tx) => {
      // Extract location data
      const { 
        address, 
        city, 
        state, 
        country, 
        postalCode, 
        coordinates 
      } = propertyData.location || {};

      // Extract property data (removing location)
      const propertyDataClone = { ...propertyData };
      delete propertyDataClone.location;

      // Default coordinates if not provided
      const longitude = coordinates?.longitude || 0;
      const latitude = coordinates?.latitude || 0;

      // Create location first using raw SQL
      const locationResult: any[] = await tx.$queryRaw`
        INSERT INTO "Location" (
          address, 
          city, 
          state, 
          country, 
          "postalCode", 
          coordinates
        ) 
        VALUES (
          ${address}, 
          ${city}, 
          ${state}, 
          ${country}, 
          ${postalCode}, 
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
        )
        RETURNING id, address, city, state, country, "postalCode";
      `;
      
      const locationId = locationResult[0].id;
      
      // Create property using the Prisma API
      return prisma.property.create({
        data: {
          ...propertyDataClone,
          locationId,
          // Make sure arrays are handled correctly
          amenities: Array.isArray(propertyDataClone.amenities) 
            ? propertyDataClone.amenities 
            : [],
          highlights: Array.isArray(propertyDataClone.highlights) 
            ? propertyDataClone.highlights 
            : [],
          photoUrls: Array.isArray(propertyDataClone.photoUrls) 
            ? propertyDataClone.photoUrls 
            : []
        },
        include: {
          location: true,
          manager: true
        }
      });
    });
  },

  update: async (id: string, propertyData: any) => {
    return prisma.$transaction(async (tx) => {
      // Extract property data (removing location)
      const propertyDataClone = { ...propertyData };
      delete propertyDataClone.location;

      // Update property
      const updatedProperty = await tx.property.update({
        where: {
          id: Number(id)
        },
        data: propertyDataClone,
        include: {
          location: true,
          manager: true
        }
      });

      // If location data is provided, update it using raw SQL
      if (propertyData.location) {
        const { 
          address, 
          city, 
          state, 
          country, 
          postalCode, 
          coordinates 
        } = propertyData.location;

        if (coordinates) {
          await tx.$executeRaw`
            UPDATE "Location"
            SET 
              address = COALESCE(${address}, address),
              city = COALESCE(${city}, city),
              state = COALESCE(${state}, state),
              country = COALESCE(${country}, country),
              "postalCode" = COALESCE(${postalCode}, "postalCode"),
              coordinates = COALESCE(
                ST_SetSRID(ST_MakePoint(${coordinates.longitude}, ${coordinates.latitude}), 4326),
                coordinates
              )
            WHERE id = ${updatedProperty.locationId}
          `;
        } else {
          await tx.$executeRaw`
            UPDATE "Location"
            SET 
              address = COALESCE(${address}, address),
              city = COALESCE(${city}, city),
              state = COALESCE(${state}, state),
              country = COALESCE(${country}, country),
              "postalCode" = COALESCE(${postalCode}, "postalCode")
            WHERE id = ${updatedProperty.locationId}
          `;
        }
      }

      // Get the updated property with location
      return PropertyRepository.findById(id);
    });
  }
};
