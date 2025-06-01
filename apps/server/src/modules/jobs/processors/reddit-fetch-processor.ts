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
      // where: {
      //   isActive: true,
      //   provider: { name: 'Reddit' },
      // },
      include: {
        user: true,
        provider: true,
      },
    });

    const integration = await integrationsService.getIntegration(
      job.data.integrationId,
    );

    for (const keyword of trackedKeywords) {
      this.logger.log(`Searching Reddit for keyword: "${keyword.keyword}"`);

      const results = await redditService.searchMention(keyword.keyword);
      this.logger.log(
        `Found ${results.length} mentions for keyword: "${keyword.keyword}"`,
      );

      for (const post of results) {
        console.log('POST: ', post);
        try {
          await postService.createUserPosts([
            {
              remoteId: post.id,
              commentCount: post?.comments.length,
              integrationId: integration.id,
              userId: keyword.user.id,
              title: post.content,

              postUrl: '',
              publishedAt: post.createdAt,
            },
          ]);

          const createdPost = await postService.findPostsBasedOnRemoteIds([
            post.id,
          ]);
          const comments = post?.comments.map((comment) => ({
            content: comment.content,
            mentionId: comment.id,
            postId: createdPost[0].id,
          }));

          if (createdPost && createdPost.length > 0) {
            // Store comments in database
            for (const comment of comments) {
              console.log('COMMENT: ', comment);
              await mentionService.createMention({
                data: {
                  content: comment.content,
                  remoteId: comment.mentionId,
                  mentionId: Number(comment.mentionId),
                  sourceType: 'REDDIT',
                  post: { connect: { id: createdPost[0].id } }, // Connect to the created post
                },
              });
            }

            this.logger.log(
              `Successfully processed video ${post.id} with ${comments.length} comments`,
            );
          } else {
            throw new Error(`Failed to find created post for video ${post.id}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process post: ${post.id}`, error);
        }
      }

      //   for (const result of results) {
      //     try {
      //       await prisma.mention.upsert({
      //         where: {
      //           remoteId_sourceType: {
      //             remoteId: result.id,
      //             sourceType: 'REDDIT',
      //           },
      //         },
      //         update: {},
      //         create: {
      //           remoteId: result.id,
      //           sourceType: 'REDDIT',
      //           content: result.text,
      //           author: result.author,
      //           sourceUrl: result.permalink,
      //           originLabel: result.subreddit,
      //           publishedAt: result.createdAt,
      //           trackedKeywordId: keyword.id,
      //           sentimentStatus: 'PENDING',
      //         },
      //       });

      //       await prisma.subTaskMention.create({
      //         data: {
      //           subTaskId: job.id,
      //           mention: {
      //             connect: {
      //               remoteId_sourceType: {
      //                 remoteId: result.id,
      //                 sourceType: 'REDDIT',
      //               },
      //             },
      //           },
      //         },
      //         skipDuplicates: true,
      //       });
      //     } catch (error) {
      //       this.logger.error(`Failed to process mention: ${result.id}`, error);
      //     }
      //   }
    }

    await prisma.subTask.update({
      where: { id: job.id },
      data: { status: 'COMPLETED' },
    });

    this.logger.log(`Reddit keyword task id=${job.id} completed.`);
  }
}
