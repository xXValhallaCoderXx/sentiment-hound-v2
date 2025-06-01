import { Mention, SentimentStatus, Prisma, prisma } from "@repo/db";
import { MentionRepository } from "./mentions.repository";

type CommentWithRelations = Mention & {
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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class CoreMentionService {
  constructor(private repository: MentionRepository) {}

  async createMention(comment: Prisma.MentionCreateArgs) {
    return this.repository.create(comment);
  }

  async createManyMentions(comments: Prisma.MentionCreateManyArgs) {
    return this.repository.createMany(comments);
  }

  async getMention(id: number): Promise<Mention> {
    const comment = await this.repository.findById(id);
    if (!comment) {
      throw new Error("Mention not found");
    }
    return comment;
  }

  async getUserMentionsWithFilters({
    userId,
    providerId,
    sentiment,
    aspect,
    page = 1,
    pageSize = 10,
  }: {
    userId: string;
    providerId?: number;
    sentiment?: string;
    aspect?: string;
    page?: number;
    pageSize?: number;
  }): Promise<
    PaginatedResult<{
      id: number;
      content: string;
      sentiment: string | null;
      provider: string;
      aspects: Array<{ aspect: string; sentiment: string }>;
    }>
  > {
    // Calculate pagination values
    const skip = (page - 1) * pageSize;

    // Construct the where clause for filtering
    const whereClause = {
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
    };

    // Get comments with pagination
    const [comments, totalCount] = await Promise.all([
      this.repository.findMany({
        where: whereClause,
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
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.repository.count(whereClause), // Fix: Pass whereClause directly as the first parameter
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Format the comments
    const formattedComments = (comments as CommentWithRelations[]).map(
      (comment) => ({
        id: comment.id,
        content: comment.content,
        sentiment: comment.sentiment,
        provider: comment.post?.integration.provider.name,
        aspects: comment.aspectAnalyses?.map((aspect: any) => ({
          aspect: aspect.aspect,
          sentiment: aspect.sentiment,
        })),
      })
    );

    return {
      data: formattedComments,
      total: totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async updateMentionSentiment(
    commentId: number,
    sentiment: string,
    aspects: { aspect: string; sentiment: string }[]
  ): Promise<Mention> {
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
      mentionId: updatedComment.id,
    }));

    await prisma.aspectAnalysis.createMany({
      data: aspectAnalyses,
    });

    return updatedComment;
  }
}
