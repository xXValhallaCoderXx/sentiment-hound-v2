import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
// import { TaskRepository } from '@repo/services';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}
