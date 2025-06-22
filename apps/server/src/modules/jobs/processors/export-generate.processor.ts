import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import { subtaskService, exportService } from '@repo/services';

@Injectable()
export class ExportGenerateProcessor {
  private readonly logger = new Logger(ExportGenerateProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing EXPORT GENERATE FILE job id=${job.id}`);

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

      this.logger.log(`Generating export file with options:`, exportOptions);

      // Generate the final export
      const exportResult = await exportService.exportData(exportOptions);

      // Mock file storage (in real implementation, upload to S3)
      const downloadUrl = await exportService.mockFileStorage(
        exportResult.fileName,
        exportResult.content,
      );

      this.logger.log(`Export file generated: ${exportResult.fileName}`);
      this.logger.log(`Records exported: ${exportResult.recordCount}`);
      this.logger.log(`Mock download URL: ${downloadUrl}`);

      // In a real implementation, we would store the download URL somewhere
      // accessible to the user, like in the task result or send via notification

      await subtaskService.markSubTaskAsCompleted(job.id);

      this.logger.log(`Export generate file completed for job ${job.id}`);
    } catch (error) {
      this.logger.error(
        `Export generate file failed for job ${job.id}:`,
        error,
      );
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
