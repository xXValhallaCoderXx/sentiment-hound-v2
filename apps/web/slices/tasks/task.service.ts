import { CoreTaskService } from "@repo/services";
import { TaskRepository } from "./task.repository";

export class TaskService {
  private coreService: CoreTaskService;

  constructor(repository: TaskRepository) {
    this.coreService = new CoreTaskService(repository);
  }

  async getTask(id: string) {
    // Add Next.js-specific logic here (e.g., caching, client-side validation)
    const task = await this.coreService.getTask(id);
    return task;
  }
}

// Create singleton instance
const repository = new TaskRepository();
export const taskService = new TaskService(repository);
