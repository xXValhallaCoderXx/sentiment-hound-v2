import { Mention, SentimentStatus, Prisma, prisma } from "@repo/db";
import { MentionRepository } from "./mentions.repository";

type CommentWithRelations = Mention & {
  post?: {
    provider: {
      name: string;
    };
    integration?: {
      provider: {
        name: string;
      };
    };
  };
  provider?: {
    name: string;
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
      createdAt?: string;
      aspects: Array<{ aspect: string; sentiment: string }>;
    }>
  > {
    // Calculate pagination values
    const skip = (page - 1) * pageSize;

    // Construct the where clause for filtering
    const whereClause: any = {
      post: {
        userId,
      },
    };

    // Handle provider filtering - support both direct and integration-based provider relationships
    if (providerId) {
      whereClause.OR = [
        // Direct provider relationship on post
        {
          post: {
            userId,
            providerId,
          },
        },
        // Fallback to integration provider relationship
        {
          post: {
            userId,
            integration: {
              providerId,
            },
          },
        },
      ];
      // Remove the base post.userId constraint since it's in the OR conditions
      delete whereClause.post;
    }

    // Add sentiment filter
    if (sentiment) {
      whereClause.sentiment = sentiment;
    }

    // Add aspect filter
    if (aspect) {
      whereClause.aspectAnalyses = {
        some: {
          aspect,
        },
      };
    }

    // Get comments with pagination
    const [comments, totalCount] = await Promise.all([
      this.repository.findMany({
        where: whereClause,
        include: {
          post: {
            include: {
              provider: true, // Direct provider relationship
              integration: {
                include: {
                  provider: true, // Fallback to integration provider
                },
              },
            },
          },
          provider: true, // Direct provider relationship on mention
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
      (comment) => {
        // Determine provider name with fallback logic
        let providerName = "unknown";
        
        // First try direct mention provider relationship
        if (comment.provider?.name) {
          providerName = comment.provider.name;
        }
        // Then try direct post provider relationship
        else if (comment.post?.provider?.name) {
          providerName = comment.post.provider.name;
        }
        // Finally fallback to integration provider relationship
        else if (comment.post?.integration?.provider?.name) {
          providerName = comment.post.integration.provider.name;
        }

        return {
          id: comment.id,
          content: comment.content,
          sentiment: comment.sentiment,
          provider: providerName,
          createdAt: comment.createdAt?.toISOString(),
          aspects: comment.aspectAnalyses?.map((aspect: any) => ({
            aspect: aspect.aspect,
            sentiment: aspect.sentiment,
          })) || [],
        };
      }
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
