"use server";

import { planService } from "@repo/services";
import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";

interface PlanUsageStats {
  integrations: { current: number; max: number };
  trackedKeywords: { current: number; max: number };
  tokens: { current: number; max: number; periodEnd: Date | null };
}

export async function getPlanUsageStats(): Promise<ActionResponse<PlanUsageStats>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated"))
      };
    }

    const stats = await planService.getPlanUsageStats(session.user.id);
    
    if (!stats) {
      return {
        data: null,
        error: createErrorResponse(new Error("No plan found for user"))
      };
    }

    return { data: stats, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function checkCanCreateIntegration(): Promise<
  ActionResponse<{ canCreate: boolean; reason?: string }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: { canCreate: false, reason: "User not authenticated" },
        error: null,
      };
    }

    const result = await planService.canUserCreateIntegration(session.user.id);
    return { data: result, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function checkCanCreateTrackedKeyword(): Promise<
  ActionResponse<{ canCreate: boolean; reason?: string }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: { canCreate: false, reason: "User not authenticated" },
        error: null,
      };
    }

    const result = await planService.canUserCreateTrackedKeyword(
      session.user.id
    );
    return { data: result, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getUserPlanFeatures(): Promise<ActionResponse<Record<string, any>>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated"))
      };
    }

    const features = await planService.getPlanFeatures(session.user.id);
    return { data: features || {}, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getTokenUsageStatus(): Promise<ActionResponse<{
  current: number;
  limit: number;
  periodEnd: Date | null;
  isOverage: boolean;
  percentage: number;
}>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated"))
      };
    }

    const status = await planService.getTokenUsageStatus(session.user.id);
    
    if (!status) {
      return {
        data: null,
        error: createErrorResponse(new Error("No plan found for user"))
      };
    }

    return { data: status, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function trackTokenUsage(tokenCount: number): Promise<ActionResponse<{
  success: boolean;
  usage: number;
  limit: number;
  isOverage: boolean;
}>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        data: null,
        error: createErrorResponse(new Error("User not authenticated"))
      };
    }

    const result = await planService.trackTokenUsage(session.user.id, tokenCount);
    return { data: result, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}