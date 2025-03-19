import { BaseRepository } from "../common/base.repository";
import { Job } from "@repo/db";

export class JobRepository extends BaseRepository<Job, number> {
  constructor(prisma: any) {
    super(prisma, "job");
  }
}
