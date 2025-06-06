"use server";

import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";
import { mentionService, planService } from "@repo/services";

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

export interface MentionItem {
  id: number;
  content: string;
  sentiment: string | null;
  provider: string;
  timestamp: string;
  aspects: Array<{ aspect: string; sentiment: string }>;
}

export interface TrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  overall: number;
}

export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    // Get user mentions with pagination to calculate stats
    const mentionsResult = await mentionService.getUserMentionsWithFilters({
      userId: session.user.id,
      page: 1,
      pageSize: 1000, // Get more mentions for better stats
    });

    const mentions = mentionsResult.data;
    const totalMentions = mentionsResult.total;

    // Calculate sentiment counts
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    mentions.forEach((mention) => {
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
      data: {
        overallSentimentScore,
        totalMentions,
        sentimentCounts,
        // TODO: Calculate changeFromPrevious based on time period comparison
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getRecentMentions(
  filters?: {
    sentiment?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ActionResponse<{ mentions: MentionItem[]; total: number; totalPages: number }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    const mentionsResult = await mentionService.getUserMentionsWithFilters({
      userId: session.user.id,
      sentiment: filters?.sentiment,
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10,
    });

    const mentions: MentionItem[] = mentionsResult.data.map((mention) => ({
      id: mention.id,
      content: mention.content,
      sentiment: mention.sentiment,
      provider: mention.provider,
      timestamp: mention.createdAt || new Date().toISOString(),
      aspects: mention.aspects,
    }));

    return {
      data: {
        mentions,
        total: mentionsResult.total,
        totalPages: mentionsResult.totalPages,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getUserPlanInfo(): Promise<ActionResponse<{
  planName: string;
  lookbackPeriod: "7days" | "30days" | "90days";
}>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    const userPlan = await planService.getUserPlan(session.user.id);
    
    // Determine lookback period based on plan
    let lookbackPeriod: "7days" | "30days" | "90days" = "30days";
    
    if (userPlan) {
      switch (userPlan.name.toLowerCase()) {
        case "trial":
          lookbackPeriod = "7days";
          break;
        case "starter":
          lookbackPeriod = "30days";
          break;
        case "premium":
        case "pro":
          lookbackPeriod = "90days";
          break;
        default:
          lookbackPeriod = "30days";
      }
    }

    return {
      data: {
        planName: userPlan?.name || "trial",
        lookbackPeriod,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getSentimentTrend(
  period: "7days" | "30days" | "90days" = "30days"
): Promise<ActionResponse<TrendDataPoint[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    // TODO: Implement actual trend calculation based on historical data
    // For now, return mock data structure
    const mockTrendData: TrendDataPoint[] = [
      { date: "2024-01-01", positive: 45, neutral: 30, negative: 25, overall: 60 },
      { date: "2024-01-02", positive: 50, neutral: 28, negative: 22, overall: 64 },
      { date: "2024-01-03", positive: 48, neutral: 32, negative: 20, overall: 64 },
      { date: "2024-01-04", positive: 52, neutral: 30, negative: 18, overall: 67 },
      { date: "2024-01-05", positive: 55, neutral: 25, negative: 20, overall: 68 },
    ];

    return {
      data: mockTrendData,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}