import { Prisma } from "@repo/db";

export type GetTaskPayload<T extends Prisma.TaskDefaultArgs> =
  Prisma.TaskGetPayload<T>;
