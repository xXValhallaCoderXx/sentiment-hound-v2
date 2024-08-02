import { prisma } from "database";
import { ICreateJobDTO, IGetUserJobsDTO } from "./job.dto";

export class JobRepository {
  async createJob(data: ICreateJobDTO) {
    return await prisma.job.create({
      data: {
        id: 1,
        taskId: 1,
      },
    });
  }

  async getUserJobs(data: IGetUserJobsDTO) {
    const { userId } = data;
    return "";
  }
}

export const jobRepository = new JobRepository();
