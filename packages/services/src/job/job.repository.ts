import { prisma } from "database";
import { ICreateJobDTO } from "./job.dto";

export class JobRepository {
  async createJob(data: ICreateJobDTO) {
    return await prisma.job.create({
      data: {
        id: 1,
        taskId: 1,
      },
    });
  }
}

export const jobRepository = new JobRepository();
