import { prisma } from "database";
import { TaskStatus } from "database";
import { ICreateJobDTO, IGetUserJobsDTO } from "./job.dto";

export class JobRepository {
  async createJob(data: ICreateJobDTO) {
    const newJob = await prisma.job.create({
      data: {
        status: TaskStatus.PENDING,
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

  async getUserJobs(data: IGetUserJobsDTO) {
    const { userId } = data;
    return "";
  }
}

export const jobRepository = new JobRepository();
