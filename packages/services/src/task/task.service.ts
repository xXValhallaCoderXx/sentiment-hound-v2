import { TaskRepository, taskRepository } from "./task.repository";
import { ICreateTask, IGetUserTasks, IStartUserTask } from "./task.interface";
import { jobRepository, JobRepository } from "../job/job.repository";
import { TaskStatus, TaskType, JobType } from "database";

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private jobRepository: JobRepository
  ) {
    this.taskRepository = taskRepository;
    this.jobRepository = jobRepository;
  }
  async createUserTask(data: ICreateTask) {
    const newTask = await this.taskRepository.createTask(data);
    if (!newTask) {
      throw new Error("Error creating task");
    }
    await this.jobRepository.createJob({
      integrationId: data.integrationId,
      taskId: newTask.id,
      type: JobType.FETCH_CONTENT,
    });

    await this.jobRepository.createJob({
      integrationId: data.integrationId,
      taskId: newTask.id,
      type: JobType.ANALYZE_CONTENT_SENTIMENT,
    });

    return newTask;
  }

  async startUserTask(data: IStartUserTask) {
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
      if (userTask.integration.provider.name === "youtube") {
        const jobs = userTask.jobs;

        // Find the first pending job
        const pendingJob = jobs.find(
          (job) => job.status === "PENDING" || job.status === "IN_PROGRESS"
        );

        if (pendingJob) {
          console.log(
            "TASK SERVICE - START USER TASK: Pending Job: ",
            pendingJob
          );

          // Update the job status to IN_PROGRESS
          await this.jobRepository.updateJob(pendingJob.id, {
            status: "IN_PROGRESS",
          });

          // Update the task status to IN_PROGRESS
          //  await this.taskRepository.updateTask({
          //   taskId: data.taskId,
          //   status: TaskStatus.IN_PROGRESS
          // });

          // Here you would trigger your job processing
          // This could be sending to a queue, calling a worker, etc.
          // switch (pendingJob.type) {
          //   case JobType.FETCH_CONTENT:
          //     // Trigger content fetching
          //     await this.processContentFetch(pendingJob);
          //     break;
          //   case JobType.ANALYZE_CONTENT_SENTIMENT:
          //     // Trigger sentiment analysis
          //     await this.processSentimentAnalysis(pendingJob);
          //     break;
          //   default:
          //     throw new Error(`Unsupported job type: ${pendingJob.type}`);
          // }

          return {
            message: `Started job ${pendingJob.id} for task ${data.taskId}`,
            job: pendingJob,
          };
        } else {
          // No pending jobs found
          return {
            message: "No pending jobs found for this task",
            job: null,
          };
        }
      } else {
        throw new Error("Provider not supported");
      }
    } else {
      throw new Error("Task type not supported");
    }
  }

  async getUserTasks(data: IGetUserTasks) {
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
