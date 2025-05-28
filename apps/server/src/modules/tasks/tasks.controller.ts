import { Controller, Get, NotFoundException } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  async getTask() {
    try {
      return await this.taskService.getTask();
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
