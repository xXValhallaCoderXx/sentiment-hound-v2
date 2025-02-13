import { ITask, ITaskRepository } from "./tasks.interface";

export class CoreTaskService {
  constructor(private repository: ITaskRepository) {}

  async getTask(id: string): Promise<ITask> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Shared business logic goes here
    // For example: task validation, transformation, etc.
    return task;
  }
}
