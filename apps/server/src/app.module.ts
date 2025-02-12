import { Module } from '@nestjs/common';
import { JobModule } from './modules/job/job.module';
import { HealthModule } from './modules/health/health.module';
import { QueueModule } from './modules/queue/queue.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), HealthModule, JobModule, QueueModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
