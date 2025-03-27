import { BaseRepository } from "../common/base.repository";
import { Task, PrismaClient, Prisma } from "@repo/db";

export class TaskRepository extends BaseRepository<"task"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "task");
  }

  async findByUserId(
    userId: string,
    args?: Omit<Prisma.TaskFindManyArgs, "where">
  ): Promise<Task[]> {
    return this.findMany({ userId }, args);
  }

  async update(
    id: number,
    data: Prisma.TaskUpdateInput,
    args?: Omit<Prisma.TaskUpdateArgs, "where" | "data">
  ): Promise<Task> {
    return super.update(id, data, args);
  }
}
