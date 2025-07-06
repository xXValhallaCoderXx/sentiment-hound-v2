import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  subtaskService,
  mentionService,
  postService,
  youtubeService,
  buildExecutionContext,
  ExecutionContext,
  IntegrationAuthenticationError,
} from '@repo/services';

/**
 * PostFetchProcessor - Unified Job Processor for Individual Post Fetching
 *
 * This processor handles fetching individual posts/videos from social media platforms
 * using the unified ExecutionContext pattern for authentication and data management.
 *
 * Key features:
 * - Unified authentication (OAuth tokens with master API key fallback)
 * - Provider-agnostic processing with provider-specific implementations
 * - Comprehensive error handling and logging
 * - Automatic comment extraction and processing
 */
@Injectable()
export class PostFetchProcessor {
  private readonly logger = new Logger(PostFetchProcessor.name);

  /**
   * Process a FETCH_INDIVIDUAL_POST_CONTENT job
   *
   * This method implements the unified execution context pattern:
   * 1. Build execution context with authentication resolution
   * 2. Route to provider-specific processing logic
   * 3. Create posts and associated comments in the database
   * 4. Handle errors gracefully with appropriate logging
   *
   * @param job - The job to process containing job ID and data payload
   * @returns Promise that resolves when processing is complete
   * @throws Will mark job as failed if processing encounters errors
   */
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH INDIVIDUAL POST job id=${job.id}`);

    try {
      // Step 1: Build unified execution context with authentication resolution
      // This handles OAuth token validation, refresh, and master API key fallback
      const context = await buildExecutionContext(job.id, job.data);

      this.logger.log(
        `Built execution context for job ${job.id}: ` +
          `provider=${context.providerName}, ` +
          `userId=${context.userId}, ` +
          `authMethod=${context.authMethod}, ` +
          `tokenSource=${context.tokenSource}${context.integrationId ? `, integrationId=${context.integrationId}` : ''}`,
      );

      // Step 2: Validate required job data
      const videoUrl = job.data.url;
      if (!videoUrl) {
        this.logger.error(`No video URL provided in job ${job.id}`);
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          'No video URL provided',
        );
        return;
      }

      // Step 3: Process based on provider (using context.providerName)
      if (context.providerName === 'YouTube') {
        await this.processYouTubeVideo(job, context, videoUrl);
      } else {
        this.logger.warn(`Provider ${context.providerName} not supported`);
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          `Provider ${context.providerName} not supported`,
        );
      }
    } catch (error) {
      if (error instanceof IntegrationAuthenticationError) {
        this.logger.error(
          `Authentication error for job ${job.id}: ${error.message}`,
        );
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          `Authentication failed: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Unexpected error processing job ${job.id}: ${error.message}`,
        );
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          `Processing failed: ${error.message}`,
        );
      }
    }
  }

  /**
   * Process a YouTube video using the execution context
   */
  private async processYouTubeVideo(
    job: Job,
    context: ExecutionContext,
    videoUrl: string,
  ): Promise<void> {
    this.logger.log(
      `Fetching YouTube content for job ${job.id} using ${context.tokenSource}`,
    );

    try {
      // Fetch single video data using the authenticated token from context
      const result = await youtubeService.fetchSingleYoutubeVideo(
        context.authToken,
        context.authMethod,
        videoUrl,
      );

      if (!result) {
        throw new Error(`Failed to fetch video data for ${videoUrl}`);
      }

      // Prepare post data
      const post = {
        userId: context.userId.toString(),
        title: result.title,
        commentCount: Number(result.statistics?.commentCount || 0),
        description: result.description,
        publishedAt: new Date(result.publishedAt),
        imageUrl: result.thumbnail,
        postUrl: videoUrl,
        remoteId: result.id,
        integrationId: context.integrationId,
        providerId: context.providerId,
      };

      // Prepare comments data
      const comments = result.comments.map((comment) => ({
        mentionId: comment.id,
        content: comment.textOriginal,
        postId: parseInt(result.id),
      }));

      // Store post in database
      await postService.createUserPosts([post]);

      // Find the newly created post to get its ID
      const createdPost = await postService.findPostsBasedOnRemoteIds([
        result.id,
      ]);

      if (createdPost && createdPost.length > 0) {
        // Store comments in database
        for (const comment of comments) {
          await mentionService.createMention({
            data: {
              content: comment.content,
              remoteId: comment.mentionId,
              mentionId: Number(comment.mentionId),
              sourceType: 'YOUTUBE',
              post: { connect: { id: createdPost[0].id } },
            },
          });
        }

        this.logger.log(
          `Successfully processed video ${result.id} with ${comments.length} comments ` +
            `using ${context.tokenSource} authentication`,
        );
      } else {
        throw new Error(`Failed to find created post for video ${result.id}`);
      }

      await subtaskService.markSubTaskAsCompleted(job.id);
    } catch (error) {
      this.logger.error(`Error processing YouTube video: ${error.message}`);
      throw error; // Re-throw to be handled by main process method
    }
  }
}
