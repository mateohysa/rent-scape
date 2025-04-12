import { PrismaClient } from "@prisma/client";

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
  }
};
