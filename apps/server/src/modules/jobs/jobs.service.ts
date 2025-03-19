import { Injectable } from '@nestjs/common';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';

export enum JobType {
  FETCH_CONTENT = 'FETCH_CONTENT',
  ANALYZE_CONTENT_SENTIMENT = 'ANALYZE_CONTENT_SENTIMENT',
}

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
  ) {
    // Register job processors
    this.processors[JobType.FETCH_CONTENT] = this.contentFetchProcessor;
    this.processors[JobType.ANALYZE_CONTENT_SENTIMENT] =
      this.sentimentAnalysisProcessor;
  }

  async processJob(job: Job) {
    const processor = this.processors[job.type];
    if (!processor) {
      throw new Error(`No processor for job type ${job.type}`);
    }
    await processor.process(job);
  }
}
