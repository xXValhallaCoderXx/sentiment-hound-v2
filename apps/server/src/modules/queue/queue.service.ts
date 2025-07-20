import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobsService } from '../jobs/jobs.service';
import { taskService } from '@repo/services';
import { prisma } from '@repo/db';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  constructor(private jobsService: JobsService) {}

  // Cron job that runs every 10 seconds
  @Cron(CronExpression.EVERY_10_SECONDS)
  async pollQueue() {
    this.logger.log('Polling queue for new tasks...');
    // Get all tasks from DB; assume tasks include a "status" field and a list of jobs.
    const tasks = await prisma.task.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        subTasks: true,
      },
    });

    if (tasks.length === 0) {
      this.logger.log('No pending tasks.');
      return;
    }

    // Pick one pending task (status: 'PENDING')
    const pendingTask = tasks[0]; // For simplicity, we take the first one

    this.logger.log(`Processing task id=${pendingTask.id}`);

    // Mark the task as IN_PROGRESS
    // await taskService.updateTaskStatus(pendingTask.id, 'IN_PROGRESS');

    // // Process each job sequentially for this task

    // // @ts-ignore
    for (const job of pendingTask.subTasks) {
      try {
        await this.jobsService.processJob(job);
        console.log('Processing job:', job);
      } catch (error) {
        this.logger.error(`Job processing failed for job id ${job.id}`, error);
        // Optionally, mark the job as FAILED
        // await jobService.markJobAsFailed(job.id, error);
        // Optionally, break out if a job fails
        break;
      }
    }

    // Mark the task as COMPLETED after all jobs have been processed
    await taskService.updateTaskStatus(pendingTask.id, 'COMPLETED');
    this.logger.log(`Task id ${pendingTask.id} processed.`);
  }
}
