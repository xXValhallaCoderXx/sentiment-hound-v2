import { Injectable } from '@nestjs/common';
import { taskService } from '@repo/services';
import type { TaskType } from '@repo/db';

@Injectable()
export class TaskService {
  async getTask() {
    // Add NestJS-specific logic here (e.g., logging, events)
    return 'task';
  }

  async createTask(data: {
    userId: string;
    integrationId: number;
    taskType?: TaskType;
    extraData?: any;
  }) {
    // NestJS wrapper for core task service
    // Add NestJS-specific logic here (e.g., logging, events, validation)
    return await taskService.createTask(data);
  }

  // Add other methods as needed
}
