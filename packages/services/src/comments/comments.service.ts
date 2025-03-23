import { Comment, SentimentStatus, Prisma } from "@repo/db";
import { CommentRepository } from "./comments.repository";
export class CoreCommentService {
  constructor(private repository: CommentRepository) {}

  async createComment(comment: Prisma.CommentCreateArgs) {
    return this.repository.create(comment);
  }

  async createManyComments(comments: Prisma.CommentCreateManyArgs) {
    return this.repository.createMany(comments);
  }

  async getComment(id: number): Promise<Comment> {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return comment;
  }

  async analyzeSentiment(id: number) {
    const comment = await this.getComment(id);

    // Update status to in progress
    // await this.repository.update(id, {
    //   sentimentStatus: SentimentStatus.IN_PROGRESS,
    // });

    // try {
    //   // TODO: Implement actual sentiment analysis
    //   const sentiment = Math.random(); // Placeholder
    //   return await this.repository.updateSentiment(id, sentiment);
    // } catch (error) {
    //   await this.repository.update(id, {
    //     sentimentStatus: SentimentStatus.FAILED,
    //   });
    //   throw error;
    // }
  }
}
