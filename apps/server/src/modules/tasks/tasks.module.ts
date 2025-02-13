// apps/server/src/modules/queue/queue.module.ts
import { Module } from '@nestjs/common';
import { BaseTaskService } from './tasks.service';
import { TaskController } from './tasks.controller';

@Module({
  providers: [BaseTaskService],
  controllers: [TaskController],
  exports: [BaseTaskService],
})
export class TasksModule {}
