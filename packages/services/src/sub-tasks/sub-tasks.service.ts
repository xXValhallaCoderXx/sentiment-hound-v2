import { SubTask, SubTaskStatus, SubTaskType, Task, User } from "@repo/db";
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
    id: number
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
