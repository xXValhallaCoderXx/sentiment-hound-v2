import { BaseRepository } from "../common/base.repository";
import { AspectAnalysis } from "@repo/db";

export class AspectAnalysisRepository extends BaseRepository<
  AspectAnalysis,
  number
> {
  constructor(prisma: any) {
    super(prisma, "aspectAnalysis");
  }

  async findByCommentId(commentId: number): Promise<AspectAnalysis[]> {
    return this.prisma.aspectAnalysis.findMany({ where: { commentId } });
  }
}
