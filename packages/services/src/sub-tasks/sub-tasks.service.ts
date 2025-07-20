import {
  SubTask,
  SubTaskStatus,
  SubTaskType,
  Task,
  User,
  Provider,
} from "@repo/db";
import { SubTaskRepository } from "./sub-tasks.repository";

export class CoreSubTaskService {
  constructor(private repository: SubTaskRepository) {}

  async getSubTask(id: number): Promise<SubTask> {
    try {
      const job = await this.repository.findById(id);

      return job;
    } catch {
      throw new Error("Subtask not found");
    }
  }

  async getAllSubTasks(): Promise<SubTask[]> {
    // Include jobs relation for each task
    return this.repository.findAll({ include: { jobs: true } });
  }

  async createSubTask({
    taskId,
    type,
    data,
  }: {
    taskId: number;
    type?: SubTaskType;
    data?: Record<string, any>;
  }): Promise<SubTask> {
    return this.repository.create({
      data: {
        task: { connect: { id: taskId } },
        data: data || {},
        type: type || SubTaskType.ANALYZE_CONTENT_SENTIMENT,
      },
    });
  }

  async getSubTaskWithUser(
    id: number,
  ): Promise<SubTask & { task: Task & { user: User } }> {
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
      throw new Error("SubTask not found");
    }

    return job;
  }

  async getUserForSubTask(id: number): Promise<User> {
    const job = await this.getSubTaskWithUser(id);
    return job.task.user;
  }

  async getTaskWithProviderForSubTask(
    id: number,
  ): Promise<SubTask & { task: Task & { user: User; provider: Provider } }> {
    const job = await this.repository.findById(id, {
      include: {
        task: {
          include: {
            user: true,
            provider: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error("SubTask not found");
    }

    if (!job.task.providerId) {
      throw new Error(
        "Critical system error: Task missing required providerId",
      );
    }

    return job;
  }

  async getProviderIdForSubTask(id: number): Promise<number> {
    const jobWithTask = await this.getTaskWithProviderForSubTask(id);
    return jobWithTask.task.providerId;
  }

  async markSubTaskAsFailed(jobId: string, error: string): Promise<SubTask> {
    return this.repository.update(Number(jobId), {
      status: SubTaskStatus.FAILED,
      errorMessage: error,
    });
  }

  async markSubTaskAsCompleted(jobId: number): Promise<SubTask> {
    return this.repository.update(Number(jobId), {
      status: SubTaskStatus.COMPLETED,
    });
  }
}
