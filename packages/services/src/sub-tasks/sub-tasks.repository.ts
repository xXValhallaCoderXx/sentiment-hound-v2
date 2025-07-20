import { BaseRepository } from "../common/base.repository";
import { PrismaClient, Prisma, SubTask } from "@repo/db";

export class SubTaskRepository extends BaseRepository<"subTask"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "subTask");
  }

  // Type-safe create method
  create(args: Prisma.SubTaskCreateArgs): Promise<SubTask> {
    return super.create(args);
  }

  // Type-safe update method
  update(
    id: number,
    data: Prisma.SubTaskUpdateInput,
    args?: Omit<Prisma.SubTaskUpdateArgs, "where" | "data">,
  ): Promise<SubTask> {
    return super.update(id, data, args);
  }

  // Type-safe methods for specific job operations
  findByTaskId(
    taskId: number,
    args?: Omit<Prisma.SubTaskFindManyArgs, "where">,
  ) {
    return this.findMany({ taskId }, args);
  }

  findPendingJobs(args?: Omit<Prisma.SubTaskFindManyArgs, "where">) {
    return this.findMany({ status: "PENDING" }, args);
  }
}
