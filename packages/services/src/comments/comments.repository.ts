import {
  ICommentRepository,
  IComment,
  SentimentStatus,
} from "./comments.interface";

export class CommentRepository implements ICommentRepository {
  constructor(private prisma: any) {}

  async create(comment: Partial<IComment>): Promise<IComment> {
    return this.prisma.comment.create({ data: comment });
  }

  async findById(id: number): Promise<IComment | null> {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async findByPostId(postId: number): Promise<IComment[]> {
    return this.prisma.comment.findMany({ where: { postId } });
  }

  async update(id: number, data: Partial<IComment>): Promise<IComment> {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  async updateSentiment(id: number, sentiment: number): Promise<IComment> {
    return this.prisma.comment.update({
      where: { id },
      data: {
        sentiment,
        sentimentStatus: SentimentStatus.COMPLETED,
      },
    });
  }
}
