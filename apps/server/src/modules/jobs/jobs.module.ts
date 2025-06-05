import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';
import { PostFetchProcessor } from './processors/post-fetch.processor';
import { RedditFetchProcessor } from './processors/reddit-fetch-processor';
import { ExportFetchProcessor } from './processors/export-fetch.processor';
import { ExportFormatProcessor } from './processors/export-format.processor';
import { ExportGenerateProcessor } from './processors/export-generate.processor';

@Module({
  providers: [
    JobsService,
    ContentFetchProcessor,
    SentimentAnalysisProcessor,
    PostFetchProcessor,
    RedditFetchProcessor,
    ExportFetchProcessor,
    ExportFormatProcessor,
    ExportGenerateProcessor,
  ],
  exports: [JobsService],
})
export class JobsModule {}
