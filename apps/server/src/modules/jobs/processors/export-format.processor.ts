import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.service';
import {
  subtaskService,
  exportService,
} from '@repo/services';

@Injectable()
export class ExportFormatProcessor {
  private readonly logger = new Logger(ExportFormatProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing EXPORT FORMAT DATA job id=${job.id}`);
    
    try {
      const { integrationId, dataType = 'mentions', format = 'csv', ...options } = job.data;
      
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
        dateRange: options.dateRange ? {
          start: new Date(options.dateRange.start),
          end: new Date(options.dateRange.end),
        } : undefined,
      };

      this.logger.log(`Formatting data with options:`, exportOptions);

      // Call export service to format the data
      const exportResult = await exportService.exportData(exportOptions);
      
      this.logger.log(`Export formatting completed: ${exportResult.recordCount} records processed`);

      // Store the export result for the next step
      // In a real implementation, we might store this in a temporary location
      // For now, we'll store minimal info and regenerate in the final step
      
      await subtaskService.markSubTaskAsCompleted(job.id);
      
      this.logger.log(`Export format data completed for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Export format data failed for job ${job.id}:`, error);
      await subtaskService.markSubTaskAsFailed(
        String(job.id),
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}