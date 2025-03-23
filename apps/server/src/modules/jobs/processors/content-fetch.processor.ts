import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  jobService,
  integrationsService,
  providerService,
  youtubeService,
  commentsService,
  postService,
} from '@repo/services';

@Injectable()
export class ContentFetchProcessor {
  private readonly logger = new Logger(ContentFetchProcessor.name);
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing FETCH_CONTENT job id=${job.id}`);

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );
    const provider = await providerService.getProvider(
      String(integration.providerId),
    );

    // TODO - Make this constant
    if (provider.name === 'youtube') {
      console.log('Fetching content from Youtube');
      const user = await jobService.getUserForJob(job.id);
      const results = await youtubeService.fetchAllYoutubePosts(user?.id);

      // Prepare posts and comments data
      const posts = results.map((result) => ({
        userId: user.id,
        title: result.title,
        commentCount: Number(result.statistics?.commentCount),
        description: result.description,
        publishedAt: new Date(result.publishedAt),
        imageUrl: result.thumbnail,
        postUrl: result.id,
        remoteId: result.id,
        integrationId: integration.id,
      }));
      // TODO - CLEAN THIS MESS WITH THE RELATIONS
      const comments = results.flatMap((result) =>
        result.comments.map((comment) => ({
          commentId: comment.id,
          content: comment.textOriginal,
          postId: result.id,
        })),
      );

      const videoIds = results.map((result) => result.id);
      await postService.createUserPosts(posts);
      const createdPosts = await postService.findPostsBasedOnRemoteIds(
        videoIds,
      );

      comments.forEach(async (comment) => {
        const post = createdPosts.find((p) => p.remoteId === comment.postId);
        if (post) {
          await commentsService.createComment({
            data: { ...comment, postId: post.id },
          });
        }
      });
    } else {
      console.log('Provider not supported');
    }

    // ...existing code to fetch content based on job.data...
    await jobService.markJobAsCompleted(job.id);
  }
}
