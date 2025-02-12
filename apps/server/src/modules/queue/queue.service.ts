import { Logger, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { jobRepository, JobRepository } from 'services/src/job/job.repository';
import { queueRepository, QueueRepository } from './queue.repository';
import { JobType } from 'database';

@Injectable()
export class QueueService {
  private queueRepository: QueueRepository;
  // private jobRepository: JobRepository;
  private readonly logger = new Logger(QueueService.name);
  private isProcessing = false;

  constructor() {
    this.queueRepository = queueRepository;
    // this.jobRepository = jobRepository;
  }

  // async addToQueue(jobId: number, payload: any) {
  //   return this.queueRepository.createQueue({
  //     jobId,
  //     payload,
  //   });
  // }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processQueue() {
    console.log('CHECKING QUEUE');
    if (this.isProcessing) {
      return;
    }

    // this.isProcessing = true;

    try {
      console.log('PROCESSING: ');
    } catch {
      console.log('ERROR: ');
    } finally {
      console.log('FINISHED: ');
    }
    // try {
    //   // Get next available job
    //   const queueItem = await this.queueRepository.findFirst();

    //   if (!queueItem) {
    //     return;
    //   }

    //   // Mark as processing
    //   await this.queueRepository.update({
    //     where: { id: queueItem.id },
    //     data: {
    //       status: 'PROCESSING',
    //       processingAt: new Date(),
    //       attempts: queueItem.attempts + 1,
    //     },
    //   });

    //   // Process based on job type
    //   try {
    //     await this.processJob(queueItem.job.type, queueItem.payload);

    //     // Mark as complete
    //     await this.queueRepository.update({
    //       where: { id: queueItem.id },
    //       data: {
    //         status: 'DONE',
    //       },
    //     });

    //     // Update job status
    //     await this.jobRepository.updateJob(queueItem.jobId, {
    //       taskId: queueItem.jobId,
    //       data: {
    //         status: 'COMPLETED',
    //       },
    //     });
    //   } catch (error) {
    //     this.logger.error(
    //       `Error processing queue item ${queueItem.id}:`,
    //       error,
    //     );

    //     const isDead = queueItem.attempts + 1 >= queueItem.maxAttempts;

    //     await this.queueRepository.update({
    //       where: { id: queueItem.id },
    //       data: {
    //         status: 'FAILED',
    //         isDead,
    //       },
    //     });

    //     if (isDead) {
    //       await this.jobRepository.updateJob(queueItem.jobId, {
    //         taskId: queueItem.jobId,
    //         data: {
    //           status: 'FAILED',
    //           errorMessage: error.message,
    //         },
    //       });
    //     }
    //   }
    // } finally {
    //   this.isProcessing = false;
    // }
  }

  private async processJob(jobType: JobType, payload: any) {
    switch (jobType) {
      case 'FETCH_CONTENT':
        return this.processFetchContent(payload);
      case 'ANALYZE_CONTENT_SENTIMENT':
        return this.processAnalyzeSentiment(payload);
      default:
        throw new Error(`Unsupported job type: ${jobType}`);
    }
  }

  private async processFetchContent(payload: any) {
    // Implement content fetching logic
    this.logger.log('Processing fetch content', payload);
  }

  private async processAnalyzeSentiment(payload: any) {
    // Implement sentiment analysis logic
    this.logger.log('Processing sentiment analysis', payload);
  }
}
