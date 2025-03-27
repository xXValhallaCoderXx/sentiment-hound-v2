import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksModule } from './modules/tasks/tasks.module';
import { QueueModule } from './modules/queue/queue.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [TasksModule, ScheduleModule.forRoot(), QueueModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
