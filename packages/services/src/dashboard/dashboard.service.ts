import { Prisma } from "@repo/db";
import { MentionRepository } from "../mentions/mentions.repository";

export interface DashboardStats {
  overallSentimentScore: number;
  totalMentions: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  changeFromPrevious?: number;
}

export interface TrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  overall: number;
}

export class CoreDashboardService {
  constructor(private mentionRepository: MentionRepository) {}

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Use aggregation to efficiently get sentiment counts without loading all records
    const sentimentAggregation = await this.mentionRepository.findMany({
      where: {
        post: {
          userId,
        },
      },
      select: {
        sentiment: true,
      },
    });

    // Also get the total count directly
    const totalMentions = await this.mentionRepository.count({
      post: {
        userId,
      },
    });

    // Calculate sentiment counts
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    sentimentAggregation.forEach((mention) => {
      const sentiment = mention.sentiment?.toLowerCase();
      if (sentiment === "positive") {
        sentimentCounts.positive++;
      } else if (sentiment === "negative") {
        sentimentCounts.negative++;
      } else {
        sentimentCounts.neutral++;
      }
    });

    // Calculate overall sentiment score (0-100)
    const overallSentimentScore = totalMentions > 0 
      ? Math.round(
          ((sentimentCounts.positive * 100 + sentimentCounts.neutral * 50) / totalMentions)
        )
      : 50; // Default to neutral if no data

    return {
      overallSentimentScore,
      totalMentions,
      sentimentCounts,
      // TODO: Calculate changeFromPrevious based on time period comparison
    };
  }

  async getSentimentTrend(
    userId: string,
    period: "7days" | "30days" | "90days" = "30days"
  ): Promise<TrendDataPoint[]> {
    // Calculate the date range based on period
    const now = new Date();
    const daysBack = period === "7days" ? 7 : period === "30days" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Get mentions within the date range grouped by date
    const mentions = await this.mentionRepository.findMany({
      where: {
        post: {
          userId,
        },
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        sentiment: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group mentions by date and calculate sentiment scores
    const dailyData: { [key: string]: { positive: number; neutral: number; negative: number; total: number } } = {};

    mentions.forEach((mention) => {
      const date = mention.createdAt?.toISOString().split('T')[0];
      if (!date) return; // Skip if date is undefined
      
      if (!dailyData[date]) {
        dailyData[date] = { positive: 0, neutral: 0, negative: 0, total: 0 };
      }

      const sentiment = mention.sentiment?.toLowerCase();
      dailyData[date].total++;
      
      if (sentiment === "positive") {
        dailyData[date].positive++;
      } else if (sentiment === "negative") {
        dailyData[date].negative++;
      } else {
        dailyData[date].neutral++;
      }
    });

    // Convert to TrendDataPoint array
    const trendData: TrendDataPoint[] = Object.entries(dailyData).map(([date, data]) => {
      // Calculate percentages
      const positivePercent = data.total > 0 ? Math.round((data.positive / data.total) * 100) : 0;
      const neutralPercent = data.total > 0 ? Math.round((data.neutral / data.total) * 100) : 0;
      const negativePercent = data.total > 0 ? Math.round((data.negative / data.total) * 100) : 0;
      
      // Calculate overall sentiment score
      const overall = data.total > 0 
        ? Math.round(((data.positive * 100 + data.neutral * 50) / data.total))
        : 50;

      return {
        date,
        positive: positivePercent,
        neutral: neutralPercent,
        negative: negativePercent,
        overall,
      };
    });

    // Fill in missing dates with neutral data if needed
    const result: TrendDataPoint[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingData = trendData.find(d => d.date === dateStr);
      
      if (existingData) {
        result.push(existingData);
      } else {
        // Add neutral data for days with no mentions
        result.push({
          date: dateStr,
          positive: 0,
          neutral: 0,
          negative: 0,
          overall: 50, // Neutral
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
}