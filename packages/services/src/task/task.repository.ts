import { prisma, TaskStatus } from "database";
import { ICreateTaskDTO, IGetUserTasksDTO } from "./task.dto";

export class TaskRepository {
  async createTask(data: ICreateTaskDTO) {
    const { userId, type, integrationId } = data;
    try {
      return await prisma.task.create({
        data: {
          type: type,
          user: {
            connect: {
              id: userId,
            },
          },
          status: TaskStatus.PENDING,
          integration: {
            connect: {
              id: integrationId,
            },
          },
        },
      });
    } catch (error) {
      console.log("Error creating task", error);
      return null;
    }
  }

  async getUserTasks(data: IGetUserTasksDTO) {
    const { userId, status } = data;
    try {
      return await prisma.task.findMany({
        where: {
          userId,
          ...(status && { status }),
        },
        include: {
          jobs: true,
          integration: {
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

  async getUserTask({ taskId }: { taskId: number }) {
    try {
      return await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          jobs: true,
          integration: {
            include: {
              provider: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("Error getting user task", error);
      return null;
    }
  }

  async deleteUserTask(taskId: number) {
    try {
      return await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
    } catch (error) {
      console.log("Error deleting task", error);
      return null;
    }
  }
}

export const taskRepository = new TaskRepository();
