import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import { subtaskService } from '@repo/services';

@Injectable()
export class ExportFetchProcessor {
  private readonly logger = new Logger(ExportFetchProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing EXPORT FETCH DATA job id=${job.id}`);

    try {
      const {
        integrationId,
        dataType = 'mentions',
        format = 'csv',
        ...options
      } = job.data;

      const user = await subtaskService.getUserForSubTask(job.id);
      if (!user) {
        throw new Error('User not found for subtask');
      }

      // Prepare export options
      const exportOptions = {
        format,
        dataType,
        userId: user.id,
        integrationId: integrationId ? Number(integrationId) : undefined,
        providerId: options.providerId ? Number(options.providerId) : undefined,
        includeAspectAnalyses: options.includeAspectAnalyses || false,
        dateRange: options.dateRange
          ? {
              start: new Date(options.dateRange.start),
              end: new Date(options.dateRange.end),
            }
          : undefined,
      };

      this.logger.log(`Export options:`, exportOptions);

      // Store export options in the subtask data for next step
      await subtaskService.markSubTaskAsCompleted(job.id);

      this.logger.log(`Export fetch data completed for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Export fetch data failed for job ${job.id}:`, error);
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
