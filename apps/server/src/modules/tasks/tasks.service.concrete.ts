import { Injectable } from '@nestjs/common';
import { BaseTaskService } from '@repo/services';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class ConcreteTaskService extends BaseTaskService {
  constructor(repository: TaskRepository) {
    super(repository);
  }
}
