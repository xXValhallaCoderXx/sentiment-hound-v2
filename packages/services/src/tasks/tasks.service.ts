import { ITaskService, ITaskRepository, ITask } from "./tasks.interface";

export abstract class BaseTaskService implements ITaskService {
  constructor(protected readonly repository: ITaskRepository) {}

  async createTask(
    userId: string,
    title: string,
    description?: string
  ): Promise<ITask> {
    return this.repository.create({
      userId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getTask(id: string): Promise<ITask> {
    const task = await this.repository.findById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }

  async getUserTasks(userId: string): Promise<ITask[]> {
    return this.repository.findByUserId(userId);
  }

  async updateTask(id: string, data: Partial<ITask>): Promise<ITask> {
    return this.repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async toggleTaskComplete(id: string): Promise<ITask> {
    return this.repository.toggleComplete(id);
  }
}
