import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ManagerRepository = {
  findByCognitoId: async (cognitoId: string) => {
    return prisma.manager.findUnique({
      where: { cognitoId }
    });
  },
  
  create: async (data: { cognitoId: string, name: string, email: string, phoneNumber: string }) => {
    return prisma.manager.create({ data });
  }
};
