import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';

@Injectable()
export class ContentFetchProcessor {
  private readonly logger = new Logger(ContentFetchProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH_CONTENT job id=${job.id}`);
    // ...existing code to fetch content based on job.data...
  }
}
