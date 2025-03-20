import { BaseRepository } from "../common/base.repository";
import { Task } from "@repo/db";

export class TaskRepository extends BaseRepository<Task, number> {
  constructor(prisma: any) {
    super(prisma, "task");
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }
}
