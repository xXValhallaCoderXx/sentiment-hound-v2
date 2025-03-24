import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  jobService,
  postService,
  integrationsService,
  providerService,
} from '@repo/services';

@Injectable()
export class SentimentAnalysisProcessor {
  private readonly logger = new Logger(SentimentAnalysisProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing ANALYZE_CONTENT_SENTIMENT job id=${job.id}`);

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );

    const posts = await postService.getUserIntegrationPosts({
      userId: integration.userId,
      integrationId: String(integration.id),
    });

    console.log('POSTS: ', posts);
    // ...existing code to analyze sentiment using an AI service...
    await jobService.markJobAsCompleted(job.id);
  }
}
