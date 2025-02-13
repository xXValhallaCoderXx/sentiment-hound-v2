import { Injectable } from '@nestjs/common';
import { BaseTaskService as BaseService, ITask } from '@repo/services';

@Injectable()
export class BaseTaskService {
  constructor(private readonly taskService: BaseService) {}

  async getTask(id: string): Promise<ITask> {
    return this.taskService.getTask(id);
  }
}
