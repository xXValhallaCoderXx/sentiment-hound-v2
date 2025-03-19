import { Task, TaskType, TaskStatus, JobType } from "@repo/db";
import { TaskRepository } from "./tasks.repository";
import { jobService } from "..";

export class CoreTaskService {
  constructor(private repository: TaskRepository) {}

  async getTask(id: number): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // Shared business logic goes here
    // For example: task validation, transformation, etc.
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    // Include jobs relation for each task
    return this.repository.findAll({ include: { jobs: true } });
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return this.repository.findByUserId(userId);
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    // Validate task exists before toggling
    return await this.getTask(id);

    // return this.repository.toggleComplete(id);
  }

  async createTask({
    providerId,
    taskType,
    userId,
  }: {
    userId: string;
    providerId?: string | FormDataEntryValue;
    taskType?: TaskType;
  }): Promise<Task> {
    const integrationId = Number(providerId) || 0;

    // Create the task first
    const task = await this.repository.create({
      type: taskType,
      integrationId,
      userId,
    });

    // Create appropriate jobs based on task type
    if (task.id) {
      switch (taskType) {
        case TaskType.FULL_SYNC:
          // Full sync needs both fetching and analyzing
          await jobService.createJob({
            taskId: task.id,
            type: JobType.FETCH_CONTENT,
            data: { integrationId },
          });
          await jobService.createJob({
            taskId: task.id,
            type: JobType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId },
          });

          break;

        case TaskType.PARTIAL_SYNC:
          // Partial sync just needs to fetch new content
          await jobService.createJob({
            taskId: task.id,
            type: JobType.FETCH_CONTENT,

            data: { integrationId },
          });

          break;

        case TaskType.ANALYZE_COMMENTS:
          // Just need sentiment analysis
          await jobService.createJob({
            taskId: task.id,
            type: JobType.FETCH_CONTENT,
            data: { integrationId },
          });
          await jobService.createJob({
            taskId: task.id,
            type: JobType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId },
          });
          break;

        default:
          // For OTHER or unspecified types, no jobs are created
          break;
      }
    }

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    // Update task with new status using repository update method
    return this.repository.update(id, { status });
  }
}
