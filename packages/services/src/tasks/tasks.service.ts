import { ITask } from "./tasks.interface";
import { TaskRepository } from "./tasks.repository";

export class CoreTaskService {
  constructor(private repository: TaskRepository) {}

  async getTask(id: string): Promise<ITask> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Shared business logic goes here
    // For example: task validation, transformation, etc.
    return task;
  }

  async getTasksByUserId(userId: string): Promise<ITask[]> {
    return this.repository.findByUserId(userId);
  }

  async toggleTaskCompletion(id: string): Promise<ITask> {
    // Validate task exists before toggling
    await this.getTask(id);
    return this.repository.toggleComplete(id);
  }
}
