import {
  PrismaClient,
  User,
  Plan,
  TaskType as PrismaTaskType,
  TaskStatus as PrismaTaskStatus,
  JobType as PrismaJobType,
} from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// Export types
export type TaskType = PrismaTaskType;
export type TaskStatus = PrismaTaskStatus;
export type JobType = PrismaJobType;

// Export enum values
export const TaskType = PrismaTaskType;
export const TaskStatus = PrismaTaskStatus;
export const JobType = PrismaJobType;

// Export Prisma models as types
export type { User, Plan };
