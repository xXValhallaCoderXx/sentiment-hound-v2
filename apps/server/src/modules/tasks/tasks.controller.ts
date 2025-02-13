import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  async getTask(@Param('id') id: string) {
    try {
      return await this.taskService.getTask(id);
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
