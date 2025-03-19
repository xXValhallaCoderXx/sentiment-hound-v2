import { Task, TaskType, TaskStatus, Job, JobStatus } from "@repo/db";
import { TaskRepository } from "./tasks.repository";

export class CoreTaskService {
  constructor(private repository: TaskRepository) {}

  async getTask(id: string): Promise<Task> {
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

  async toggleTaskCompletion(id: string): Promise<Task> {
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
    return this.repository.create({
      type: taskType,
      integrationId,
      userId,
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    // Update task with new status using repository update method
    return this.repository.update(id, { status });
  }

  async markJobAsFailed(jobId: string, error: string): Promise<Job> {
    return this.repository.updateJob(Number(jobId), {
      status: JobStatus.FAILED,
      errorMessage: error,
    });
  }
}
