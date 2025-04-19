// /apps/server/src/jobs/processors/reddit-fetch.processor.ts
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import { prisma } from '@repo/db';
// import { redditService } from '@repo/services';

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
      },
      include: {
        user: true,
      },
    });

    for (const keyword of trackedKeywords) {
      this.logger.log(`Searching Reddit for keyword: "${keyword.keyword}"`);

      //   const results = await redditService.searchMentions(keyword.keyword);

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
