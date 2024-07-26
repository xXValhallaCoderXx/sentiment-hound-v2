import { PrismaClient, User, SyncStatus, SyncType } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export { User, SyncStatus, SyncType };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
