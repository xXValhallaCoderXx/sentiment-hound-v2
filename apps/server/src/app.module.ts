import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './modules/tasks/tasks.module';
import { QueueModule } from './modules/queue/queue.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    TasksModule,
    ScheduleModule.forRoot(),
    QueueModule,
    JobsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make config globally available
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
