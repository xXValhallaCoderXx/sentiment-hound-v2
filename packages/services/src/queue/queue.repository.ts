import { prisma } from "database";
import { ICreateQueue, IUpdateQueue } from "./queue.interface";
import { ResourceCreateError, ResourceCreateErrorCodes } from "../errors";

export class QueueRepository {
  async createQueue(data: ICreateQueue) {
    try {
      return prisma.queue.create({
        data: {
          jobId: data.jobId,
          payload: data.payload,
          status: "NEW",
        },
      });
    } catch (error) {
      throw new ResourceCreateError(
        ResourceCreateErrorCodes.TASK_CREATE,
        "We couldn't create your task, Please try again later",
        error
      );
    }
  }

  async update(data: IUpdateQueue) {
    try {
      return await prisma.queue.update({
        where: { id: data.where.id },
        data: {
          status: data?.data?.status,
          processingAt: data?.data?.processingAt,
          attempts: data?.data?.attempts,
          isDead: data?.data?.isDead,
        },
      });
    } catch (error) {
      throw new ResourceCreateError(
        ResourceCreateErrorCodes.TASK_CREATE,
        "We couldn't create your task, Please try again later",
        error
      );
    }
  }
  async findFirst() {
    try {
      return await prisma.queue.findFirst({
        where: {
          status: "NEW",
          isDead: false,
          attempts: {
            lt: 3, // Max attempts
          },
        },
        include: {
          job: true,
        },
      });
    } catch (error) {
      throw new ResourceCreateError(
        ResourceCreateErrorCodes.TASK_CREATE,
        "We couldn't create your task, Please try again later",
        error
      );
    }
  }
}

export const queueRepository = new QueueRepository();
