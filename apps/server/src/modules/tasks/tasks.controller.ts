import { Controller, Get, NotFoundException, Post, Body } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateExportTaskDto } from './export.dto';
import { TaskType } from '@repo/db';
import { taskService as coreTaskService } from '@repo/services';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  async getTask() {
    try {
      return await this.taskService.getTask();
    } catch {
      throw new NotFoundException('Task not found');
    }
  }

  @Post('export')
  async createExportTask(@Body() createExportTaskDto: CreateExportTaskDto) {
    try {
      const {
        userId,
        integrationId,
        dataType,
        format,
        providerId,
        includeAspectAnalyses,
        startDate,
        endDate,
      } = createExportTaskDto;

      const extraData = {
        dataType,
        format,
        providerId,
        includeAspectAnalyses: includeAspectAnalyses || false,
        dateRange:
          startDate && endDate
            ? {
                start: startDate,
                end: endDate,
              }
            : undefined,
      };

      const task = await coreTaskService.createTask({
        userId,
        integrationId,
        taskType: TaskType.EXPORT_DATA,
        extraData,
      });

      return {
        success: true,
        task,
        message:
          'Export task created successfully. You will be notified when the export is ready.',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create export task',
      };
    }
  }
}
