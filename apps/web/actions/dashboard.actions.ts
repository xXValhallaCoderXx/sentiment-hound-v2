"use server";

import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";
import { mentionService, planService, dashboardService, DashboardStats, TrendDataPoint } from "@repo/services";

// Re-export types for components
export type { DashboardStats, TrendDataPoint };

export interface MentionItem {
  id: number;
  content: string;
  sentiment: string | null;
  provider: string;
  timestamp: string;
  aspects: Array<{ aspect: string; sentiment: string }>;
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

    const stats = await dashboardService.getDashboardStats(session.user.id);

    return {
      data: stats,
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

    const trendData = await dashboardService.getSentimentTrend(session.user.id, period);

    return {
      data: trendData,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}