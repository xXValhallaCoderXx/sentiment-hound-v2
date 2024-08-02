import { prisma, TaskStatus } from "database";
import { ICreateTaskDTO, IGetUserTasksDTO } from "./task.dto";

export class TaskRepository {
  async createTask(data: ICreateTaskDTO) {
    const { userId, type } = data;
    try {
      return await prisma.task.create({
        data: {
          type: type,
          userId,
          status: TaskStatus.PENDING,
        },
      });
    } catch (error) {
      console.log("Error creating task", error);
      return null;
    }
  }

  async getUserTasks(data: IGetUserTasksDTO) {
    const { userId } = data;
    try {
      return await prisma.task.findMany({
        where: {
          userId,
        },
        include: {
          jobs: true,
          syncs: {
            include: {
              provider: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("Error getting user tasks", error);
      return null;
    }
  }
}

export const taskRepository = new TaskRepository();
