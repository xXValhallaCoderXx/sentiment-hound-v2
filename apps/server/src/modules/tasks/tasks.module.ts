import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TaskRepository } from './tasks.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TasksModule {}
