import { Mention, Post, Prisma, prisma } from "@repo/db";
import { PostRepository } from "./posts.repository";
import { ICreatePost } from "./post.interface";
import { PostWithComments, ProcessedPost } from "./post.interface";

export class CorePostService {
  constructor(private repository: PostRepository) {}

  async getUserProcessedPosts({
    userId,
    page = 1,
    pageSize = 10,
    includeComments = false,
    includeAspectAnalyses = false,
    providerId,
    integrationId,
    startDate,
    endDate,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    onlyWithComments = false,
  }: {
    userId: string;
    page?: number;
    pageSize?: number;
    includeComments?: boolean;
    includeAspectAnalyses?: boolean;
    providerId?: number;
    integrationId?: number;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onlyWithComments?: boolean;
  }) {
    // Calculate pagination values
    const skip = (page - 1) * pageSize;

    // Build where clause
    const whereClause: Prisma.PostWhereInput = {
      userId,
    };

    // Add provider filter if specified
    if (providerId) {
      whereClause.integration = {
        providerId,
      };
    }

    // Add integration filter if specified
    if (integrationId) {
      whereClause.integrationId = integrationId;
    }

    // Add date range filters if specified
    if (startDate || endDate) {
      whereClause.publishedAt = {};
      if (startDate) {
        whereClause.publishedAt.gte = startDate;
      }
      if (endDate) {
        whereClause.publishedAt.lte = endDate;
      }
    }

    // Add search term filter if specified
    if (searchTerm) {
      whereClause.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Only include posts with comments if specified
    if (onlyWithComments) {
      whereClause.mentions = {
        some: {},
      };
    }

    // Build include options
    const includeOptions: Prisma.PostInclude = {};

    if (includeComments) {
      includeOptions.mentions = {
        include: includeAspectAnalyses
          ? {
              aspectAnalyses: true,
            }
          : undefined,
      };
    }

    // Include integration and provider info
    includeOptions.integration = {
      include: {
        provider: true,
      },
    };

    // Get posts with pagination
    const [posts, totalCount] = await Promise.all([
      this.repository.findMany({
        where: whereClause,
        include: includeOptions,
        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.repository.count(whereClause),
    ]);

    // Process posts if aspect analyses are requested
    let processedPosts = posts;
    if (includeComments && includeAspectAnalyses) {
      processedPosts = posts.map((post: any) => {
        // Calculate sentiment counts and percentages
        const sentimentCounts = post.comments.reduce(
          (acc: any, comment: Mention) => {
            if (comment.sentiment === "POSITIVE") acc.positive++;
            else if (comment.sentiment === "NEGATIVE") acc.negative++;
            else acc.neutral++;
            return acc;
          },
          { positive: 0, neutral: 0, negative: 0 }
        );

        const totalComments = post.comments.length || 1;
        const sentimentPercentages = {
          positive: Math.round(
            (sentimentCounts.positive / totalComments) * 100
          ),
          neutral: Math.round((sentimentCounts.neutral / totalComments) * 100),
          negative: Math.round(
            (sentimentCounts.negative / totalComments) * 100
          ),
        };

        // Process aspect analyses
        const aspectAnalyses = post.comments.reduce(
          (acc: any, comment: any) => {
            comment.aspectAnalyses?.forEach((aspect: any) => {
              const sentiment = aspect.sentiment.toLowerCase();
              if (!acc[sentiment][aspect.aspect]) {
                acc[sentiment][aspect.aspect] = 0;
              }
              acc[sentiment][aspect.aspect]++;
            });
            return acc;
          },
          {
            positive: {} as Record<string, number>,
            neutral: {} as Record<string, number>,
            negative: {} as Record<string, number>,
          }
        );

        return {
          ...post,
          sentimentCounts,
          sentimentPercentages,
          aspectAnalyses,
        };
      });
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Return paginated result
    return {
      data: processedPosts,
      total: totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  /* OLD POSTS */

  async getPost(id: number): Promise<Post> {
    const post = await this.repository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  async findPostsBasedOnRemoteIds(videoIds: string[]): Promise<Post[]> {
    return this.repository.findMany({ where: { remoteId: { in: videoIds } } });
  }

  async getUserPostsByProvider(
    userId: string,
    providerId: number
  ): Promise<Post[]> {
    return this.repository.findMany({
      where: {
        userId,
        integration: {
          providerId,
        },
      },
      include: {
        mentions: true,
      },
    });
  }

  async getUserIntegrationPosts({
    userId,
    integrationId,
  }: {
    userId: string;
    integrationId: string;
  }) {
    return this.findUserIntegrationPosts({
      userId,
      integrationId: parseInt(integrationId),
    });
  }

  async getComputedIntegrationList({
    userId,
    integrationId,
    args,
  }: {
    userId: string;
    integrationId: number;
    args?: Omit<Prisma.PostFindManyArgs, "where">;
  }): Promise<ProcessedPost[]> {
    const posts = await this.repository.findMany({
      where: {
        userId,
        integrationId,
        mentions: {
          some: {}, // This ensures only posts with comments are returned
        },
      },
      include: {
        mentions: {
          include: {
            aspectAnalyses: true,
          },
        },
      },
      ...args,
    });

    return posts.map((post: any) => {
      const sentimentCounts = post.comments.reduce(
        (acc: any, comment: Mention) => {
          if (comment.sentiment === "POSITIVE") acc.positive++;
          else if (comment.sentiment === "NEGATIVE") acc.negative++;
          else acc.neutral++;
          return acc;
        },
        { positive: 0, neutral: 0, negative: 0 }
      );

      const totalComments = post.comments.length || 1;
      const sentimentPercentages = {
        positive: Math.round((sentimentCounts.positive / totalComments) * 100),
        neutral: Math.round((sentimentCounts.neutral / totalComments) * 100),
        negative: Math.round((sentimentCounts.negative / totalComments) * 100),
      };

      const aspectAnalyses = post.comments.reduce(
        (acc: any, comment: any) => {
          comment.aspectAnalyses.forEach((aspect: any) => {
            const sentiment = aspect.sentiment.toLowerCase();
            if (!acc[sentiment][aspect.aspect]) {
              acc[sentiment][aspect.aspect] = 0;
            }
            acc[sentiment][aspect.aspect]++;
          });
          return acc;
        },
        {
          positive: {} as Record<string, number>,
          neutral: {} as Record<string, number>,
          negative: {} as Record<string, number>,
        }
      );

      return {
        ...post,
        sentimentCounts,
        sentimentPercentages,
        aspectAnalyses,
      };
    });
  }

  async findUserIntegrationPosts({
    userId,
    integrationId,
    args,
  }: {
    userId: string;
    integrationId: number;
    args?: Omit<Prisma.PostFindManyArgs, "where">;
  }): Promise<PostWithComments[]> {
    return this.repository.findMany({
      where: {
        userId,
        integrationId,
        mentions: {
          some: {}, // This ensures only posts with comments are returned
        },
      },
      include: {
        mentions: {
          include: {
            aspectAnalyses: true,
          },
        },
      },
      ...args,
    }) as Promise<PostWithComments[]>;
  }
  async findByUserId(
    userId: string,
    args?: Omit<Prisma.PostFindManyArgs, "where">
  ): Promise<Post[]> {
    return this.repository.findMany({
      where: {
        userId,
      },
      ...args,
    });
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.findByUserId(userId);
  }

  async createUserPost(data: ICreatePost): Promise<Post> {
    const { userId, title } = data;
    return this.repository.create({
      data: {
        userId,
        title,
        commentCount: data?.commentCount || 0,
        description: data?.description || "",
        publishedAt: data?.publishedAt || new Date(),
        imageUrl: data?.imageUrl || "",
        postUrl: data?.postUrl || "",
        remoteId: data?.remoteId || "",
        integrationId: data?.integrationId || 0,
      },
    });
  }

  async createUserPosts(data: Prisma.PostCreateManyInput[]) {
    return this.repository.createMany({ data });
  }

  async batchCreateComments(data: Prisma.MentionCreateManyInput[]) {
    return prisma.mention.createMany({ data });
  }
}
