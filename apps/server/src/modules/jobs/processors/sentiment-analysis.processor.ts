/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  jobService,
  postService,
  integrationsService,
  providerService,
  commentsService,
} from '@repo/services';

interface IAnalysisResponse {
  id: string;
  text: string;
  general_sentiment: {
    score: number;
    label: string;
  };
  aspect_sentiment: [
    {
      aspect: string;

      sentiment: string;
    },
  ];
}
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

    // @ts-ignore
    // const comments = posts?.comments;

    const comments = posts?.map((post) => post?.comments)?.flat();
    const preparedComments = comments?.map((comment) => ({
      id: String(comment.id),
      value: comment.content,
    }));
    console.log('preparedComments', preparedComments);

    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: preparedComments }),
    });
    const data: IAnalysisResponse[] = await response.json();
    console.log('RESPONSE: ', data);

    const processedComments = data.map((comment) => ({
      id: comment.id,
      sentiment: comment.general_sentiment.label,
      score: comment.general_sentiment.score,
      aspects: comment.aspect_sentiment.map((aspect) => ({
        aspect: aspect.aspect,
        sentiment: aspect.sentiment,
      })),
    }));
    console.log('processedComments', processedComments);

    for (const comment of processedComments) {
      await commentsService.updateCommentSentiment(
        parseInt(comment.id),
        comment.sentiment,
        comment.aspects,
      );
    }

    console.log('UPDATE COMPLETED');

    // ...existing code to analyze sentiment using an AI service...
    await jobService.markJobAsCompleted(job.id);
  }
}
