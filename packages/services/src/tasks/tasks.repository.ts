import { ITaskRepository, ITask } from "./tasks.interface";

export class TaskRepository implements ITaskRepository {
  constructor(private prisma: any) {}

  async create(task: Partial<ITask>): Promise<ITask> {
    return this.prisma.task.create({ data: task });
  }

  async findById(id: string): Promise<ITask | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<ITask[]> {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  async toggleComplete(id: string): Promise<ITask> {
    const task = await this.findById(id);
    return this.prisma.task.update({
      where: { id },
      data: { completed: !task?.completed },
    });
  }
}
