import { TaskRepository, taskRepository } from "./task.repository";
import { ICreateTaskDTO, IGetUserTasksDTO } from "./task.dto";
import { jobRepository, JobRepository } from "../job/job.repository";

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
    const job = await this.jobRepository.createJob({
      integrationId: data.integrationId,
      taskId: newTask.id,
    });
    console.log("JOB", job);
    return newTask;
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
