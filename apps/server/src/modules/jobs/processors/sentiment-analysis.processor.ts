/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  subtaskService,
  mentionService,
  buildExecutionContext,
  ExecutionContext,
  IntegrationAuthenticationError,
} from '@repo/services';
import { prisma } from '@repo/db';

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

  /**
   * Processes sentiment analysis for mentions using the unified ExecutionContext pattern.
   *
   * This method implements the refactored authentication approach that supports both:
   * - OAuth user tokens (when integrationId is present)
   * - Master API key scenarios (when integrationId is null, uses userId+providerId)
   *
   * The process flow:
   * 1. Build ExecutionContext with unified authentication resolution
   * 2. Query mentions using conditional logic based on context
   * 3. Create SubTaskMentions in a database transaction for consistency
   * 4. Process mentions in batches through the sentiment analysis API
   * 5. Update mention sentiment data and SubTaskMention statuses
   *
   * Authentication scenarios:
   * - OAuth: Uses context.integrationId to filter mentions by integration
   * - Master API Key: Uses context.userId + context.providerId to filter mentions
   *
   * @param job - The sentiment analysis job containing SubTask data
   * @throws IntegrationAuthenticationError - When authentication context cannot be built
   * @throws Error - For other unexpected errors during processing
   */
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing ANALYZE_CONTENT_SENTIMENT job id=${job.id}`);

    try {
      // Step 1: Build unified execution context with authentication resolution
      const context: ExecutionContext = await buildExecutionContext(
        job.id,
        job.data,
      );

      this.logger.log(
        `Built context for SubTask ${job.id}: { userId: ${context.userId}, providerName: ${context.providerName}, authMethod: ${context.authMethod}, integrationId: ${context.integrationId} }`,
      );

      // Log authentication method for transparency
      if (context.integrationId === null) {
        this.logger.log(
          `Using master API key authentication for SubTask ${job.id} (integrationId is null)`,
        );
      }

      // Step 2: Query mentions with conditional logic based on context
      const whereClause = context.integrationId
        ? {
            sentimentStatus: 'PENDING' as const,
            post: {
              integrationId: context.integrationId,
            },
          }
        : {
            sentimentStatus: 'PENDING' as const,
            post: {
              userId: context.userId,
              providerId: context.providerId,
            },
          };

      // Step 3: Execute mention query and SubTaskMention creation in transaction
      const { pendingComments } = await prisma.$transaction(async (tx) => {
        const pendingComments = await tx.mention.findMany({
          where: whereClause,
        });

        await tx.subTaskMention.createMany({
          data: pendingComments.map((comment) => ({
            subTaskId: job.id,
            mentionId: comment.id,
            status: 'PENDING',
          })),
          skipDuplicates: true,
        });

        return { pendingComments };
      });

      // If there are no pending comments, mark the job as completed and return
      if (!pendingComments?.length) {
        this.logger.log(`No pending comments to analyze for job id=${job.id}`);
        await subtaskService.markSubTaskAsCompleted(job.id);
        return;
      }

      const preparedComments = pendingComments?.map((comment) => ({
        id: String(comment.id),
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
            const commentId = parseInt(comment.id);

            try {
              // Update Comment sentiment data
              await mentionService.updateMentionSentiment(
                commentId,
                comment.sentiment,
                comment.aspects,
              );

              // Update SubTaskComment status
              await prisma.subTaskMention.update({
                where: {
                  subTaskId_mentionId: {
                    subTaskId: job.id,
                    mentionId: commentId,
                  },
                },
                data: {
                  status: 'COMPLETED',
                  analysis: JSON.stringify(comment), // or just sentiment summary
                },
              });
            } catch (error) {
              this.logger.error(
                `Failed to update comment/subtaskComment for commentId=${commentId}`,
              );

              // Mark subtask comment as failed
              await prisma.subTaskMention.update({
                where: {
                  subTaskId_mentionId: {
                    subTaskId: job.id,
                    mentionId: commentId,
                  },
                },
                data: {
                  status: 'FAILED',
                  analysis: JSON.stringify({
                    error: error.message,
                    commentId,
                  }),
                },
              });
            }
          }

          this.logger.log(`Batch ${i + 1}/${batches.length} completed`);
        } catch (error) {
          this.logger.error(
            `Error processing batch ${i + 1}: ${error.message}`,
          );
          // Continue with the next batch instead of failing the entire job
        }
      }

      this.logger.log(`All batches processed for job id=${job.id}`);
      await subtaskService.markSubTaskAsCompleted(job.id);
    } catch (error) {
      if (error instanceof IntegrationAuthenticationError) {
        this.logger.error(
          `Failed to build ExecutionContext for SubTask ${job.id}: ${error.message}`,
        );
        await subtaskService.markSubTaskAsFailed(String(job.id), error.message);
        return;
      }

      // Handle other errors
      this.logger.error(
        `Error processing sentiment analysis job ${job.id}:`,
        error,
      );
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
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
