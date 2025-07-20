import { BaseRepository } from "../common/base.repository";
import { AspectAnalysis, PrismaClient, Prisma } from "@repo/db";

export class AspectAnalysisRepository extends BaseRepository<"aspectAnalysis"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "aspectAnalysis");
  }

  async findByCommentId(
    commentId: number,
    args?: Omit<Prisma.AspectAnalysisFindManyArgs, "where">,
  ): Promise<AspectAnalysis[]> {
    return this.findMany({ commentId }, args);
  }

  async update(
    id: number,
    data: Prisma.AspectAnalysisUpdateInput,
    args?: Omit<Prisma.AspectAnalysisUpdateArgs, "where" | "data">,
  ): Promise<AspectAnalysis> {
    return super.update(id, data, args);
  }
}
