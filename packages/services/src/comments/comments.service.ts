import {
  IComment,
  ICommentRepository,
  SentimentStatus,
} from "./comments.interface";

export class CoreCommentService {
  constructor(private repository: ICommentRepository) {}

  async getComment(id: number): Promise<IComment> {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return comment;
  }

  async analyzeSentiment(id: number): Promise<IComment> {
    const comment = await this.getComment(id);

    // Update status to in progress
    await this.repository.update(id, {
      sentimentStatus: SentimentStatus.IN_PROGRESS,
    });

    try {
      // TODO: Implement actual sentiment analysis
      const sentiment = Math.random(); // Placeholder
      return await this.repository.updateSentiment(id, sentiment);
    } catch (error) {
      await this.repository.update(id, {
        sentimentStatus: SentimentStatus.FAILED,
      });
      throw error;
    }
  }
}
