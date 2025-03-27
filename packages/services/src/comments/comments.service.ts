import { Comment, SentimentStatus, Prisma, prisma } from "@repo/db";
import { CommentRepository } from "./comments.repository";


type CommentWithRelations = Comment & {
  post: {
    integration: {
      provider: {
        name: string;
      };
    };
  };
  aspectAnalyses: Array<{
    aspect: string;
    sentiment: string;
  }>;
};
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

  async getUserCommentsWithFilters({
    userId,
    providerId,
    sentiment,
    aspect,
  }: {
    userId: string;
    providerId?: number;
    sentiment?: string;
    aspect?: string;
  }): Promise<
    Array<{
      id: number;
      content: string;
      sentiment: string | null;
      provider: string;
      aspects: Array<{ aspect: string; sentiment: string }>;
    }>
  > {
    const comments = await this.repository.findMany({
      where: {
        post: {
          userId,
          integration: providerId
            ? {
                providerId,
              }
            : undefined,
        },
        sentiment: sentiment ? sentiment : undefined,
        aspectAnalyses: aspect
          ? {
              some: {
                aspect,
              },
            }
          : undefined,
      },
      include: {
        post: {
          include: {
            integration: {
              include: {
                provider: true,
              },
            },
          },
        },
        aspectAnalyses: true,
      },
    });

    return (comments as CommentWithRelations[]).map((comment) => ({
      id: comment.id,
      content: comment.content,
      sentiment: comment.sentiment,
      provider: comment.post?.integration.provider.name,
      aspects: comment.aspectAnalyses?.map((aspect: any) => ({
        aspect: aspect.aspect,
        sentiment: aspect.sentiment,
      })),
    }));
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
