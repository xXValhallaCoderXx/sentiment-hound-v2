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

    if (provider.name !== 'youtube') {
      this.logger.warn(`Provider '${provider.name}' is not supported`);
      return;
    }

    const user = await subtaskService.getUserForSubTask(job.id);
    if (!user) {
      this.logger.warn(`No user found for subtask ${job.id}`);
      return;
    }

    const youtubePosts = await youtubeService.fetchAllYoutubePosts(user.id);

    const posts = youtubePosts.map((video) => ({
      userId: user.id,
      title: video.title,
      commentCount: Number(video.statistics?.commentCount),
      description: video.description,
      publishedAt: new Date(video.publishedAt),
      imageUrl: video.thumbnail,
      postUrl: video.id,
      remoteId: video.id,
      integrationId: integration.id,
    }));

    // Create posts and keep a map of remoteId => postId
    await postService.createUserPosts(posts);
    const createdPosts = await postService.findPostsBasedOnRemoteIds(
      posts.map((p) => p.remoteId),
    );
    const postMap = new Map(createdPosts.map((p) => [p.remoteId, p.id]));

    // Flatten comments and attach correct postId
    const mentions = youtubePosts.flatMap((video) => {
      const postId = postMap.get(video.id);
      if (!postId) return [];

      return video.comments.map((comment) => ({
        commentId: comment.id,

        content: comment.textOriginal,
        post: { connect: { id: postId } }, // <== THIS is the key fix
      }));
    });

    await Promise.all(
      mentions.map((mention) =>
        mentionService.createMention({
          data: {
            content: mention.content,
            remoteId: mention.commentId,
            mentionId: Number(mention.commentId),
            sourceType: 'YOUTUBE',
            post: mention.post,
          },
        }),
      ),
    );

    await subtaskService.markSubTaskAsCompleted(job.id);
    this.logger.log(`Finished FETCH_CONTENT job id=${job.id}`);
  }
}