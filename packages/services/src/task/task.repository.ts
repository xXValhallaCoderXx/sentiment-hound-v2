import { prisma, TaskStatus } from "database";
import { ICreateTaskDTO } from "./task.dto";

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
}

export const taskRepository = new TaskRepository();
