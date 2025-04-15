/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  subtaskService,
  postService,
  integrationsService,
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
  private readonly BATCH_SIZE = 25;

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing ANALYZE_CONTENT_SENTIMENT job id=${job.id}`);

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );

    const posts = await postService.getUserIntegrationPosts({
      userId: integration.userId,
      integrationId: String(integration.id),
    });

    const comments = posts?.map((post) => post?.comments)?.flat();

    // Filter out comments that already have a sentimentStatus of COMPLETED
    const pendingComments = comments?.filter(
      (comment) => comment?.sentimentStatus !== 'COMPLETED',
    );

    // If there are no pending comments, mark the job as completed and return
    if (!pendingComments?.length) {
      this.logger.log(`No pending comments to analyze for job id=${job.id}`);
      await subtaskService.markSubTaskAsCompleted(job.id);
      return;
    }

    const preparedComments = pendingComments?.map((comment) => ({
      // @ts-ignore
      id: String(comment.id),
      // @ts-ignore
      value: comment.content,
    }));

    this.logger.log(`Total comments to process: ${preparedComments.length}`);

    // Batch the comments into groups of BATCH_SIZE
    const batches = this.chunkArray(preparedComments, this.BATCH_SIZE);
    this.logger.log(
      `Batched into ${batches.length} groups of ${this.BATCH_SIZE}`,
    );

    // Process each batch synchronously
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      this.logger.log(
        `Processing batch ${i + 1}/${batches.length} with ${
          batch.length
        } comments`,
      );

      try {
        // Process the current batch
        const response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: batch }),
        });

        const data: IAnalysisResponse[] = await response.json();
        this.logger.log(`Received response for batch ${i + 1}`);

        const processedComments = data.map((comment) => ({
          id: comment.id,
          sentiment: comment.general_sentiment.label,
          score: comment.general_sentiment.score,
          aspects: comment.aspect_sentiment.map((aspect) => ({
            aspect: aspect.aspect,
            sentiment: aspect.sentiment,
          })),
        }));

        // Update each comment in the current batch
        for (const comment of processedComments) {
          await commentsService.updateCommentSentiment(
            parseInt(comment.id),
            comment.sentiment,
            comment.aspects,
          );
        }

        this.logger.log(`Batch ${i + 1}/${batches.length} completed`);
      } catch (error) {
        this.logger.error(`Error processing batch ${i + 1}: ${error.message}`);
        // Continue with the next batch instead of failing the entire job
      }
    }

    this.logger.log(`All batches processed for job id=${job.id}`);
    await subtaskService.markSubTaskAsCompleted(job.id);
  }

  /**
   * Helper method to split an array into chunks of the specified size
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
