import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
