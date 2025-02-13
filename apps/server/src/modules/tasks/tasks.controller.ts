import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ConcreteTaskService } from './tasks.service.concrete';

@Controller('tasks')
export class TaskController {
  constructor(
    @Inject('TaskService')
    private readonly taskService: ConcreteTaskService,
  ) {}

  @Get(':id')
  async getTask(@Param('id') id: string) {
    try {
      const task = await this.taskService.getTask(id);
      return task;
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
