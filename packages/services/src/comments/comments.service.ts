import { Comment, SentimentStatus, Prisma, prisma } from "@repo/db";
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

  async updateCommentSentiment(
    commentId: number,
    sentiment: string,
    aspects: { aspect: string; sentiment: string }[]
  ): Promise<Comment> {
    console.log("ASPESCTS: ", aspects);
    // Update the sentiment of the comment
    const updatedComment = await this.repository.update(commentId, {
      sentiment,
      sentimentStatus: SentimentStatus.COMPLETED,
    });

    // Create aspect analyses for the comment
    const aspectAnalyses = aspects.map((aspect) => ({
      aspect: aspect.aspect,
      sentiment: aspect.sentiment,
      commentId: updatedComment.id,
    }));

    await prisma.aspectAnalysis.createMany({
      data: aspectAnalyses,
    });

    return updatedComment;
  }
}
