import { Injectable } from '@nestjs/common';
import { CoreTaskService, TaskRepository } from '@repo/services';

@Injectable()
export class TaskService {
  private coreService: CoreTaskService;

  constructor(private readonly repository: TaskRepository) {
    this.coreService = new CoreTaskService(repository);
  }

  async getTask(id: string) {
    // Add NestJS-specific logic here (e.g., logging, events)
    const task = await this.coreService.getTask(id);
    return task;
  }

  // Add other methods as needed
}
