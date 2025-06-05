import { Injectable } from '@nestjs/common';
import { SubTaskType } from '@repo/db';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';
import { PostFetchProcessor } from './processors/post-fetch.processor';
import { RedditFetchProcessor } from './processors/reddit-fetch-processor';
import { ExportFetchProcessor } from './processors/export-fetch.processor';
import { ExportFormatProcessor } from './processors/export-format.processor';
import { ExportGenerateProcessor } from './processors/export-generate.processor';
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
    private readonly exportFetchProcessor: ExportFetchProcessor,
    private readonly exportFormatProcessor: ExportFormatProcessor,
    private readonly exportGenerateProcessor: ExportGenerateProcessor,
  ) {
    // Register job processors
    this.processors[SubTaskType.FETCH_CONTENT] = this.contentFetchProcessor;
    this.processors[SubTaskType.ANALYZE_CONTENT_SENTIMENT] =
      this.sentimentAnalysisProcessor;
    this.processors[SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT] =
      this.postFetchProcessor;
    this.processors[SubTaskType.FETCH_REDDIT_KEYWORD_MENTIONS] =
      this.redditFetchProcessor;
    this.processors[SubTaskType.EXPORT_FETCH_DATA] = this.exportFetchProcessor;
    this.processors[SubTaskType.EXPORT_FORMAT_DATA] = this.exportFormatProcessor;
    this.processors[SubTaskType.EXPORT_GENERATE_FILE] = this.exportGenerateProcessor;
  }

  async processJob(job: Job) {
    const processor = this.processors[job.type];
    if (!processor) {
      throw new Error(`No processorsss for job type ${job.type}`);
    }
    await processor.process(job);
  }
}
