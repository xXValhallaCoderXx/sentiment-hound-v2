import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  subtaskService,
  integrationsService,
  providerService,
  youtubeService,
  mentionService,
  postService,
} from '@repo/services';
import { prisma } from '@repo/db';

@Injectable()
export class PostFetchProcessor {
  private readonly logger = new Logger(PostFetchProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH INDIVIDUAL POST job id=${job.id}`);
    console.log('JOOOB', job);
    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );
    const provider = await providerService.getProvider(
      String(integration.providerId),
    );

    const videoUrl = job.data.url;

    if (!videoUrl) {
      this.logger.error(`No video URL provided in job ${job.id}`);
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        'No video URL provided',
      );
      return;
    }

    // TODO - Make this constant
    if (provider.name === 'youtube') {
      console.log('Fetching content from Youtube');
      const user = await subtaskService.getUserForSubTask(job.id);

      try {
        // Fetch single video data
        const result = await youtubeService.fetchSingleYoutubeVideo(
          user?.id,
          videoUrl,
        );

        if (!result) {
          throw new Error(`Failed to fetch video data for ${videoUrl}`);
        }

        // Prepare post data
        const post = {
          userId: user.id,
          title: result.title,
          commentCount: Number(result.statistics?.commentCount),
          description: result.description,
          publishedAt: new Date(result.publishedAt),
          imageUrl: result.thumbnail,
          postUrl: videoUrl,
          remoteId: result.id,
          integrationId: integration.id,
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
                post: { connect: { id: createdPost[0].id } }, // Connect to the created post
              },
            });
          }

          this.logger.log(
            `Successfully processed video ${result.id} with ${comments.length} comments`,
          );
        } else {
          throw new Error(`Failed to find created post for video ${result.id}`);
        }

        await subtaskService.markSubTaskAsCompleted(job.id);
      } catch (error) {
        this.logger.error(`Error processing video: ${error.message}`);
        await subtaskService.markSubTaskAsFailed(String(job.id), error.message);
      }
    } else {
      this.logger.warn(`Provider ${provider.name} not supported`);
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        'Provider not supported',
      );
    }
  }
}
