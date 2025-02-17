import {
  IAspectAnalysis,
  IAspectAnalysisRepository,
} from "./aspects.interface";

export class CoreAspectAnalysisService {
  constructor(private repository: IAspectAnalysisRepository) {}

  async getAspectAnalysis(id: number): Promise<IAspectAnalysis> {
    const analysis = await this.repository.findById(id);
    if (!analysis) {
      throw new Error("Aspect analysis not found");
    }
    return analysis;
  }

  async getCommentAspects(commentId: number): Promise<IAspectAnalysis[]> {
    return this.repository.findByCommentId(commentId);
  }

  async createAspectAnalysis(
    commentId: number,
    aspect: string,
    sentiment: number
  ): Promise<IAspectAnalysis> {
    return this.repository.create({
      commentId,
      aspect,
      sentiment,
    });
  }
}
