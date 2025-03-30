import { Injectable } from '@nestjs/common';
import { JobType } from '@repo/db';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';
import { PostFetchProcessor } from './processors/post-fetch.processor';
export interface Job {
  id: number;
  type: JobType;
  data: any;
}

@Injectable()
export class JobsService {
  // Modified to use Partial<Record<...>>
  private processors: Partial<
    Record<JobType, { process: (job: Job) => Promise<void> }>
  > = {};

  constructor(
    private readonly contentFetchProcessor: ContentFetchProcessor,
    private readonly sentimentAnalysisProcessor: SentimentAnalysisProcessor,
    private readonly postFetchProcessor: PostFetchProcessor,
  ) {
    // Register job processors
    this.processors[JobType.FETCH_CONTENT] = this.contentFetchProcessor;
    this.processors[JobType.ANALYZE_CONTENT_SENTIMENT] =
      this.sentimentAnalysisProcessor;
    this.processors[JobType.FETCH_INDIVIDUAL_POST_CONTNENT] =
      this.postFetchProcessor;
  }

  async processJob(job: Job) {
    const processor = this.processors[job.type];
    if (!processor) {
      throw new Error(`No processorsss for job type ${job.type}`);
    }
    await processor.process(job);
  }
}
