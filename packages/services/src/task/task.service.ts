import { TaskRepository, taskRepository } from "./task.repository";
import {
  ICreateTaskDTO,
  IGetUserTasksDTO,
  IStartUserTaskDTO,
} from "./task.dto";
import { jobRepository, JobRepository } from "../job/job.repository";
import { TaskStatus, TaskType } from "database";

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private jobRepository: JobRepository
  ) {
    this.taskRepository = taskRepository;
    this.jobRepository = jobRepository;
  }
  async createUserTask(data: ICreateTaskDTO) {
    const newTask = await this.taskRepository.createTask(data);
    if (!newTask) {
      throw new Error("Error creating task");
    }
    await this.jobRepository.createJob({
      integrationId: data.integrationId,
      taskId: newTask.id,
    });

    return newTask;
  }

  async startUserTask(data: IStartUserTaskDTO) {
    const getRunningTasks = await this.taskRepository.getUserTasks({
      userId: data.userId,
      status: TaskStatus.IN_PROGRESS,
    });

    if (!getRunningTasks || getRunningTasks.length > 0) {
      throw new Error("User already has a task running");
    }

    const userTask = await this.taskRepository.getUserTask({
      taskId: data.taskId,
    });

    if (!userTask) {
      throw new Error("Task not found");
    }

    if (userTask.type === TaskType.FULL_SYNC) {
      // TODO: Add logic to start full sync
      console.log("Starting full sync");
      console.log("FULL SYNC", userTask);
      if (userTask.integration.provider.name === "youtube") {
        // TODO: Add logic to start youtube sync
      } else {
        throw new Error("Provider not supported");
      }
    } else {
      throw new Error("Task type not supported");
    }
  }

  async getUserTasks(data: IGetUserTasksDTO) {
    const tasks = await this.taskRepository.getUserTasks(data);

    return tasks;
  }

  async cancelAllTasks(taskId: number) {
    // await prisma.task.update({
    //   where: { id: taskId },
    //   data: { status: 'CANCELLED' },
    // });

    // await prisma.job.updateMany({
    //   where: { taskId },
    //   data: { status: 'CANCELLED' },
    // });

    // await prisma.sync.updateMany({
    //   where: { taskId },
    //   data: { status: 'CANCELLED' },
    // });

    return { message: "Cancel all tasks" };
  }

  async deleteUserTask(taskId: number) {
    await this.taskRepository.deleteUserTask(taskId);

    return { message: `#${taskId} - Cancelled` };
  }
}

export const taskService = new TaskService(taskRepository, jobRepository);
