import { TaskRepository, taskRepository } from "./task.repository";
import { ICreateTaskDTO, IGetUserTasksDTO } from "./task.dto";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }
  async createUserTask(data: ICreateTaskDTO) {
    const newTask = await this.taskRepository.createTask(data);

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

export const taskService = new TaskService(taskRepository);
