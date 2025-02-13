import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { ConcreteTaskService } from './tasks.service.concrete';
import { TaskRepository } from './tasks.repository';

@Module({
  controllers: [TaskController],
  providers: [
    TaskRepository,
    {
      provide: 'TaskService',
      useClass: ConcreteTaskService,
    },
  ],
})
export class TasksModule {}
