import { BaseRepository } from "../common/base.repository";
import { Task } from "@repo/db";

export class TaskRepository extends BaseRepository<Task, string> {
  constructor(prisma: any) {
    super(prisma, "task");
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async toggleComplete(id: string): Promise<Task> {
    const task = await this.findById(id);
    return this.update(id, { completed: !task?.completed });
  }
}
