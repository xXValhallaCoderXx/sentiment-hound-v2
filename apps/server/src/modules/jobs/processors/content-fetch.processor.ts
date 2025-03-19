import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import { jobService } from '@repo/services';

@Injectable()
export class ContentFetchProcessor {
  private readonly logger = new Logger(ContentFetchProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH_CONTENT job id=${job.id}`);
    // ...existing code to fetch content based on job.data...
    await jobService.markJobAsCompleted(job.id);
  }
}
