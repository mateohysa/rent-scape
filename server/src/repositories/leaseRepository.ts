import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAllLeases = async () => {
  return prisma.lease.findMany({
    include: {
      tenant: true,
      property: true,
    },
  });
};

export const findLeasePayments = async (leaseId: number) => {
  return prisma.payment.findMany({
    where: { leaseId },
  });
};
