import { Injectable } from '@nestjs/common';
import { ITask } from '@repo/services';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async getTask(id: string): Promise<ITask> {
    const task = await this.repository.findById(id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  // Add other methods as needed
}
