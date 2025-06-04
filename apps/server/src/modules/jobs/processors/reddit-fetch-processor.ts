// /apps/server/src/jobs/processors/reddit-fetch.processor.ts
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import { prisma } from '@repo/db';
import {
  redditService,
  postService,
  integrationsService,
  mentionService,
} from '@repo/services';

@Injectable()
export class RedditFetchProcessor {
  private readonly logger = new Logger(RedditFetchProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(
      `Processing FETCH_REDDIT_KEYWORD_MENTIONS job id=${job.id}`,
    );

    const trackedKeywords = await prisma.trackedKeyword.findMany({
      where: {
        isActive: true,
        provider: { name: 'Reddit' },
        user: {
          integrations: {
            some: { id: job.data.integrationId },
          },
        },
      },
      include: {
        user: true,
        provider: true,
      },
    });

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );

    if (!integration) {
      throw new Error(`Integration not found: ${job.data.integrationId}`);
    }

    if (trackedKeywords.length === 0) {
      this.logger.log(
        `No active Reddit keywords found for integration ${job.data.integrationId}`,
      );
      await prisma.subTask.update({
        where: { id: job.id },
        data: { status: 'COMPLETED' },
      });
      return;
    }

    this.logger.log(
      `Found ${trackedKeywords.length} Reddit keywords to process`,
    );

    for (const keyword of trackedKeywords) {
      this.logger.log(`Searching Reddit for keyword: "${keyword.keyword}"`);

      // Use OAuth token if available for better rate limits
      const results = await redditService.searchMention(
        keyword.keyword,
        integration.accessToken,
      );
      this.logger.log(
        `Found ${results.length} mentions for keyword: "${keyword.keyword}"`,
      );

      for (const post of results) {
        try {
          await postService.createUserPosts([
            {
              remoteId: post.id,
              commentCount: post?.comments?.length || 0,
              integrationId: integration.id,
              userId: keyword.user.id,
              title: post.content.substring(0, 255), // Ensure title fits database constraints
              postUrl: post.permalink,
              publishedAt: post.createdAt,
            },
          ]);

          const createdPost = await postService.findPostsBasedOnRemoteIds([
            post.id,
          ]);

          if (createdPost && createdPost.length > 0) {
            // Store comments in database
            for (const comment of post.comments || []) {
              await mentionService.createMention({
                data: {
                  content: comment.content,
                  remoteId: comment.id,
                  mentionId: Math.abs(
                    comment.id.split('').reduce((a, b) => {
                      a = (a << 5) - a + b.charCodeAt(0);
                      return a & a;
                    }, 0),
                  ), // Simple hash of Reddit comment ID
                  sourceType: 'REDDIT',
                  author: comment.author,
                  sourceUrl: post.permalink,
                  originLabel: post.subreddit,
                  createdAt: comment.createdAt,
                  // trackedKeywordId: keyword.id,
                  sentimentStatus: 'PENDING',
                  post: { connect: { id: createdPost[0].id } },
                },
              });
            }

            this.logger.log(
              `Successfully processed Reddit post ${post.id} with ${
                post.comments?.length || 0
              } comments`,
            );
          } else {
            throw new Error(
              `Failed to find created post for Reddit post ${post.id}`,
            );
          }
        } catch (error) {
          this.logger.error(`Failed to process Reddit post: ${post.id}`, error);
        }
      }
    }

    await prisma.subTask.update({
      where: { id: job.id },
      data: { status: 'COMPLETED' },
    });

    this.logger.log(`Reddit keyword task id=${job.id} completed.`);
  }
}
