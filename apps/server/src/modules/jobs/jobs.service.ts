import { Injectable } from '@nestjs/common';
import { SubTaskType } from '@repo/db';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';
import { PostFetchProcessor } from './processors/post-fetch.processor';
import { RedditFetchProcessor } from './processors/reddit-fetch-processor';
export interface Job {
  id: number;
  type: SubTaskType;
  data: any;
}

@Injectable()
export class JobsService {
  // Modified to use Partial<Record<...>>
  private processors: Partial<
    Record<SubTaskType, { process: (job: Job) => Promise<void> }>
  > = {};

  constructor(
    private readonly contentFetchProcessor: ContentFetchProcessor,
    private readonly sentimentAnalysisProcessor: SentimentAnalysisProcessor,
    private readonly postFetchProcessor: PostFetchProcessor,
    private readonly redditFetchProcessor: RedditFetchProcessor,
  ) {
    // Register job processors
    this.processors[SubTaskType.FETCH_CONTENT] = this.contentFetchProcessor;
    this.processors[SubTaskType.ANALYZE_CONTENT_SENTIMENT] =
      this.sentimentAnalysisProcessor;
    this.processors[SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT] =
      this.postFetchProcessor;
    this.processors[SubTaskType.FETCH_REDDIT_KEYWORD_MENTIONS] =
      this.redditFetchProcessor;
  }

  async processJob(job: Job) {
    const processor = this.processors[job.type];
    if (!processor) {
      throw new Error(`No processorsss for job type ${job.type}`);
    }
    await processor.process(job);
  }
}
