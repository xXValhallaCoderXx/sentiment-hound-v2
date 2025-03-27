import { Job, JobStatus, JobType, Task, User } from "@repo/db";
import { JobRepository } from "./jobs.repository";

export class CoreJobService {
  constructor(private repository: JobRepository) {}

  async getJob(id: number): Promise<Job> {
    const job = await this.repository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Shared business logic goes here
    // For example: task validation, transformation, etc.
    return job;
  }

  async getAllJobs(): Promise<Job[]> {
    // Include jobs relation for each task
    return this.repository.findAll({ include: { jobs: true } });
  }

  async createJob({
    taskId,
    type,
    data,
  }: {
    taskId: number;
    type?: JobType;
    data?: Record<string, any>;
  }): Promise<Job> {
    return this.repository.create({
      data: {
        task: { connect: { id: taskId } },
        data: data || {},
        type: type || JobType.ANALYZE_CONTENT_SENTIMENT,
      },
    });
  }

  async getJobWithUser(
    id: number
  ): Promise<Job & { task: Task & { user: User } }> {
    const job = await this.repository.findById(id, {
      include: {
        task: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  }

  async getUserForJob(id: number): Promise<User> {
    const job = await this.getJobWithUser(id);
    return job.task.user;
  }

  async markJobAsFailed(jobId: string, error: string): Promise<Job> {
    return this.repository.update(Number(jobId), {
      status: JobStatus.FAILED,
      errorMessage: error,
    });
  }

  async markJobAsCompleted(jobId: number): Promise<Job> {
    return this.repository.update(Number(jobId), {
      status: JobStatus.COMPLETED,
    });
  }
}
