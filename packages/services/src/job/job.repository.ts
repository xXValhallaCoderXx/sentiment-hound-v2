import { prisma } from "database";
import { TaskStatus, JobType } from "database";
import { ICreateJobDTO, IGetUserJobsDTO } from "./job.dto";

export class JobRepository {
  async createJob(data: ICreateJobDTO) {
    const newJob = await prisma.job.create({
      data: {
        status: TaskStatus.PENDING,
        type: data.type,
        data: {
          integrationId: data.integrationId,
        },
        task: {
          connect: {
            id: data.taskId,
          },
        },
      },
    });

    return newJob;
  }

  async updateJob(
    id: number,
    data: Partial<{
      status: TaskStatus;
      type: JobType;
      data?: any;
      taskId: number;
    }>
  ) {
    const updatedJob = await prisma.job.update({
      where: {
        id,
      },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.type && { type: data.type }),
        ...(data.data && { data: data.data }),
        ...(data.taskId && {
          task: {
            connect: { id: data.taskId },
          },
        }),
      },
    });

    return updatedJob;
  }

  async getUserJobs(data: IGetUserJobsDTO) {
    const { userId } = data;
    return "";
  }
}

export const jobRepository = new JobRepository();
