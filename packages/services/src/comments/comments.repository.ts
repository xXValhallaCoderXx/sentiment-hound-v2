import { SentimentStatus, Comment } from "@repo/db";
import { BaseRepository } from "../common/base.repository";

export class CommentRepository extends BaseRepository<"comment"> {
  constructor(prisma: any) {
    super(prisma, "comment");
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    return super.findMany({ postId });
  }

  async updateSentiment(id: number, sentiment: number): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data: {
        sentiment,
        sentimentStatus: SentimentStatus.COMPLETED,
      },
    });
  }
}
