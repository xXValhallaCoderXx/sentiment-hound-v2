import { BaseRepository } from "../common/base.repository";
import { Task, Job } from "@repo/db";

export class TaskRepository extends BaseRepository<Task, string> {
  constructor(prisma: any) {
    super(prisma, "task");
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  // Add this method to update a job record
  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    return this.prisma.job.update({ where: { id }, data });
  }

  // async toggleComplete(id: string): Promise<Task> {
  //   const task = await this.findById(id);
  //   return this.update(id, { completed: !task?.completed });
  // }
}
