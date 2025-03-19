import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ContentFetchProcessor } from './processors/content-fetch.processor';
import { SentimentAnalysisProcessor } from './processors/sentiment-analysis.processor';

@Module({
  providers: [JobsService, ContentFetchProcessor, SentimentAnalysisProcessor],
  exports: [JobsService],
})
export class JobsModule {}
