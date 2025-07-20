import { Prisma, prisma } from "@repo/db";
import { mentionService, postService } from "..";

export interface ExportOptions {
  format: "csv" | "json";
  dataType: "mentions" | "posts";
  userId: string;
  integrationId?: number;
  providerId?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAspectAnalyses?: boolean;
}

export interface ExportResult {
  fileName: string;
  content: string;
  contentType: string;
  recordCount: number;
}

export class CoreExportService {
  async exportData(options: ExportOptions): Promise<ExportResult> {
    const { dataType, format } = options;

    let data: any[];
    let recordCount = 0;

    // Fetch data based on type
    switch (dataType) {
      case "mentions":
        data = await this.fetchMentionsData(options);
        break;
      case "posts":
        data = await this.fetchPostsData(options);
        break;
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }

    recordCount = data.length;

    // Format data based on format
    let content: string;
    let contentType: string;
    let fileName: string;

    switch (format) {
      case "csv":
        content = this.formatAsCSV(data, dataType);
        contentType = "text/csv";
        fileName = `${dataType}_export_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "json":
        content = JSON.stringify(data, null, 2);
        contentType = "application/json";
        fileName = `${dataType}_export_${new Date().toISOString().split("T")[0]}.json`;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    return {
      fileName,
      content,
      contentType,
      recordCount,
    };
  }

  private async fetchMentionsData(options: ExportOptions) {
    const whereClause: Prisma.MentionWhereInput = {
      post: {
        userId: options.userId,
      },
    };

    // Add integration filter if specified
    if (options.integrationId) {
      (whereClause.post as any).integrationId = options.integrationId;
    }

    // Add provider filter if specified (note: this will override integrationId if both are provided)
    if (options.providerId) {
      (whereClause.post as any).integration = {
        providerId: options.providerId,
      };
    }

    // Add date range filter if specified
    if (options.dateRange) {
      whereClause.createdAt = {
        gte: options.dateRange.start,
        lte: options.dateRange.end,
      };
    }

    const includeOptions: Prisma.MentionInclude = {
      post: {
        include: {
          integration: {
            include: {
              provider: true,
            },
          },
        },
      },
    };

    if (options.includeAspectAnalyses) {
      includeOptions.aspectAnalyses = true;
    }

    const mentions = await prisma.mention.findMany({
      where: whereClause,
      include: includeOptions,
      orderBy: {
        createdAt: "desc",
      },
    });

    return mentions.map((mention: any) => ({
      id: mention.id,
      content: mention.content,
      sentiment: mention.sentiment,
      score: mention.score,
      author: mention.author,
      sourceUrl: mention.sourceUrl,
      originLabel: mention.originLabel,
      provider: mention.post?.integration?.provider?.name,
      postTitle: mention.post?.title,
      postUrl: mention.post?.postUrl,
      createdAt: mention.createdAt,
      aspectAnalyses: options.includeAspectAnalyses
        ? mention.aspectAnalyses?.map((aspect: any) => ({
            aspect: aspect.aspect,
            sentiment: aspect.sentiment,
            score: aspect.score,
          }))
        : undefined,
    }));
  }

  private async fetchPostsData(options: ExportOptions) {
    const whereClause: Prisma.PostWhereInput = {
      userId: options.userId,
    };

    // Add integration filter if specified
    if (options.integrationId) {
      whereClause.integrationId = options.integrationId;
    }

    // Add provider filter if specified
    if (options.providerId) {
      whereClause.integration = {
        providerId: options.providerId,
      };
    }

    // Add date range filter if specified
    if (options.dateRange) {
      whereClause.publishedAt = {
        gte: options.dateRange.start,
        lte: options.dateRange.end,
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        integration: {
          include: {
            provider: true,
          },
        },
        mentions: options.includeAspectAnalyses
          ? {
              include: {
                aspectAnalyses: true,
              },
            }
          : true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return posts.map((post: any) => {
      const mentionsData = post.mentions || [];
      const sentimentCounts = mentionsData.reduce(
        (acc: any, mention: any) => {
          if (mention.sentiment === "POSITIVE") acc.positive++;
          else if (mention.sentiment === "NEGATIVE") acc.negative++;
          else acc.neutral++;
          return acc;
        },
        { positive: 0, neutral: 0, negative: 0 },
      );

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        postUrl: post.postUrl,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        commentCount: post.commentCount,
        provider: post.integration?.provider?.name,
        sentimentCounts,
        totalMentions: mentionsData.length,
        aspectAnalyses: options.includeAspectAnalyses
          ? mentionsData.reduce((acc: any, mention: any) => {
              mention.aspectAnalyses?.forEach((aspect: any) => {
                const sentiment = aspect.sentiment.toLowerCase();
                if (!acc[sentiment]) acc[sentiment] = {};
                if (!acc[sentiment][aspect.aspect]) {
                  acc[sentiment][aspect.aspect] = 0;
                }
                acc[sentiment][aspect.aspect]++;
              });
              return acc;
            }, {})
          : undefined,
      };
    });
  }

  private formatAsCSV(data: any[], dataType: string): string {
    if (data.length === 0) return "";

    // Get all unique keys from the data
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] !== "object" || item[key] === null) {
          allKeys.add(key);
        } else if (key === "sentimentCounts") {
          // Handle sentiment counts specially
          allKeys.add("positive_count");
          allKeys.add("neutral_count");
          allKeys.add("negative_count");
        }
      });
    });

    const headers = Array.from(allKeys);
    const csvRows = [headers.join(",")];

    data.forEach((item) => {
      const row = headers.map((header) => {
        let value = item[header];

        // Handle special cases
        if (header === "positive_count")
          value = item.sentimentCounts?.positive || 0;
        else if (header === "neutral_count")
          value = item.sentimentCounts?.neutral || 0;
        else if (header === "negative_count")
          value = item.sentimentCounts?.negative || 0;
        else if (value === null || value === undefined) value = "";
        else if (typeof value === "object") value = JSON.stringify(value);
        else if (typeof value === "string" && value.includes(",")) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      });

      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  }

  async mockFileStorage(fileName: string, content: string): Promise<string> {
    // Mock implementation - in real scenario, this would upload to S3 or similar
    console.log(
      `Mock storing file: ${fileName}, size: ${content.length} characters`,
    );

    // Return a mock download URL
    return `/api/exports/download/${fileName}`;
  }
}
