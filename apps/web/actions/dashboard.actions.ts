"use server";

import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";
import {
  mentionService,
  planService,
  dashboardService,
  taskService,
  DashboardStats,
  TrendDataPoint,
} from "@repo/services";
import { TaskType, TaskStatus, Task } from "@repo/db";
import type { AnalysisData } from "@/types/analysis.types";

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

export async function getDashboardStats(): Promise<
  ActionResponse<DashboardStats>
> {
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
  } catch (error: unknown) {
    return {
      data: null,
      error: createErrorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
      ),
    };
  }
}

export async function getRecentMentions(filters?: {
  sentiment?: string;
  page?: number;
  pageSize?: number;
}): Promise<
  ActionResponse<{ mentions: MentionItem[]; total: number; totalPages: number }>
> {
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

    const mentions: MentionItem[] = mentionsResult.data.map(
      (mention: {
        id: number;
        content: string;
        sentiment: string | null;
        provider: string;
        createdAt?: string;
        aspects: Array<{ aspect: string; sentiment: string }>;
      }) => ({
        id: mention.id,
        content: mention.content,
        sentiment: mention.sentiment,
        provider: mention.provider,
        timestamp: mention.createdAt || new Date().toISOString(),
        aspects: mention.aspects,
      }),
    );

    return {
      data: {
        mentions,
        total: mentionsResult.total,
        totalPages: mentionsResult.totalPages,
      },
      error: null,
    };
  } catch (error: unknown) {
    return {
      data: null,
      error: createErrorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
      ),
    };
  }
}

export async function getUserPlanInfo(): Promise<
  ActionResponse<{
    planName: string;
    lookbackPeriod: "7days" | "30days" | "90days";
  }>
> {
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
  } catch (error: unknown) {
    return {
      data: null,
      error: createErrorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
      ),
    };
  }
}

export async function getSentimentTrend(
  period: "7days" | "30days" | "90days" = "30days",
): Promise<ActionResponse<TrendDataPoint[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    const trendData = await dashboardService.getSentimentTrend(
      session.user.id,
      period,
    );

    return {
      data: trendData,
      error: null,
    };
  } catch (error: unknown) {
    return {
      data: null,
      error: createErrorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
      ),
    };
  }
}

export async function getUserAnalyses(filters?: {
  status?: TaskStatus;
  page?: number;
  pageSize?: number;
}): Promise<
  ActionResponse<{
    analyses: AnalysisData[];
    total: number;
    totalPages: number;
  }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated")),
      };
    }

    const userId = session.user.id;

    // For now, use a simpler approach with getFilteredTasks
    const tasks = await taskService.getFilteredTasks(userId, {
      type: TaskType.ANALYZE_POST,
      ...(filters?.status && { status: filters.status }),
    });

    // Sort by creation date descending
    const sortedTasks = tasks.sort(
      (a: Task, b: Task) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    // Handle pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const paginatedTasks = sortedTasks.slice(skip, skip + pageSize);

    // Transform tasks into AnalysisData format
    const analyses: AnalysisData[] = paginatedTasks.map((task: Task) => {
      // Map TaskStatus to analysis status
      let status: "PROCESSING" | "COMPLETED" | "FAILED";
      switch (task.status) {
        case TaskStatus.COMPLETED:
          status = "COMPLETED";
          break;
        case TaskStatus.FAILED:
          status = "FAILED";
          break;
        default:
          status = "PROCESSING";
          break;
      }

      return {
        id: task.id.toString(),
        url: "", // Will be populated when we get related data
        title: `Analysis Task ${task.id}`,
        status,
        overallScore: 0, // Will be calculated when we get sentiment data
        commentCount: 0, // Will be calculated when we get mention data
        createdAt: task.createdAt,
      };
    });

    const totalPages = Math.ceil(tasks.length / pageSize);

    return {
      data: {
        analyses,
        total: tasks.length,
        totalPages,
      },
      error: null,
    };
  } catch (error: unknown) {
    return {
      data: null,
      error: createErrorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
      ),
    };
  }
}
