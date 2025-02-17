import {
  IAspectAnalysisRepository,
  IAspectAnalysis,
} from "./aspects.interface";

export class AspectAnalysisRepository implements IAspectAnalysisRepository {
  constructor(private prisma: any) {}

  async create(analysis: Partial<IAspectAnalysis>): Promise<IAspectAnalysis> {
    return this.prisma.aspectAnalysis.create({ data: analysis });
  }

  async findById(id: number): Promise<IAspectAnalysis | null> {
    return this.prisma.aspectAnalysis.findUnique({ where: { id } });
  }

  async findByCommentId(commentId: number): Promise<IAspectAnalysis[]> {
    return this.prisma.aspectAnalysis.findMany({ where: { commentId } });
  }

  async update(
    id: number,
    data: Partial<IAspectAnalysis>
  ): Promise<IAspectAnalysis> {
    return this.prisma.aspectAnalysis.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.aspectAnalysis.delete({ where: { id } });
  }
}
