import { BaseRepository } from "../common/base.repository";
import { PrismaClient, Prisma, Job } from "@repo/db";

export class JobRepository extends BaseRepository<"job"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "job");
  }

  // Type-safe create method
  create(args: Prisma.JobCreateArgs): Promise<Job> {
    return super.create(args);
  }

  // Type-safe update method
  update(
    id: number,
    data: Prisma.JobUpdateInput,
    args?: Omit<Prisma.JobUpdateArgs, "where" | "data">
  ): Promise<Job> {
    return super.update(id, data, args);
  }

  // Type-safe methods for specific job operations
  findByTaskId(taskId: number, args?: Omit<Prisma.JobFindManyArgs, "where">) {
    return this.findMany({ taskId }, args);
  }

  findPendingJobs(args?: Omit<Prisma.JobFindManyArgs, "where">) {
    return this.findMany({ status: "PENDING" }, args);
  }
}
