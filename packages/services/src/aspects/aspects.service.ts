import { AspectAnalysis } from "@repo/db";
import { AspectAnalysisRepository } from "./aspects.repository";
export class CoreAspectAnalysisService {
  constructor(private repository: AspectAnalysisRepository) {}

  async getAspectAnalysis(id: number): Promise<AspectAnalysis> {
    const analysis = await this.repository.findById(id);
    if (!analysis) {
      throw new Error("Aspect analysis not found");
    }
    return analysis;
  }

  async getCommentAspects(commentId: number): Promise<AspectAnalysis[]> {
    return this.repository.findByCommentId(commentId);
  }

  async createAspectAnalysis(
    commentId: number,
    aspect: string,
    sentiment: number,
  ): Promise<AspectAnalysis> {
    return this.repository.create({
      data: {
        comment: { connect: { id: commentId } },
        aspect,
        sentiment,
      },
    });
  }
}
