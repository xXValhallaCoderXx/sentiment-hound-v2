import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  jobService,
  integrationsService,
  providerService,
} from '@repo/services';

@Injectable()
export class PostFetchProcessor {
  private readonly logger = new Logger(PostFetchProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH INDIVIDUAL POST job id=${job.id}`);

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );
    const provider = await providerService.getProvider(
      String(integration.providerId),
    );

    // TODO - Make this constant
    if (provider.name === 'youtube') {
      console.log('Fetching content from Youtube');
    } else {
      console.log('Provider not supported');
    }

    // ...existing code to fetch content based on job.data...
    await jobService.markJobAsCompleted(job.id);
  }
}
