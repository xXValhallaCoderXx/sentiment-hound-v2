import { Plan, Prisma, User } from "@repo/db";
import { PlanRepository } from "./plans.repository";

export class CorePlanService {
  constructor(private repository: PlanRepository) {}

  getPlans(): Promise<Plan[]> {
    return this.repository.findAll({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  }

  addUserToPlan(id: string | number, userId: string): Promise<Plan> {
    return this.repository.update(id, {
      users: {
        connect: { id: userId },
      },
    });
  }

  removeUserFromPlan(id: string | number, userId: string): Promise<Plan> {
    return this.repository.update(id, {
      users: {
        disconnect: { id: userId },
      },
    });
  }

  updatePlan(
    id: string | number,
    data: Partial<Plan>,
    args?: Omit<Prisma.PlanUpdateArgs, "where" | "data">
  ): Promise<Plan> {
    // Ensure features: null is converted to Prisma.JsonNull for Prisma compatibility
    const patchedData = {
      ...data,
      features: data.features === null ? Prisma.JsonNull : data.features,
    };
    return this.repository.update(id, patchedData, args);
  }

  findPlanById(
    id: string | number,
    args?: Omit<Prisma.PlanFindUniqueArgs, "where">
  ): Promise<Plan | null> {
    return this.repository.findById(id, args);
  }

  async getUserPlan(userId: string): Promise<Plan | null> {
    const user = await this.repository.findUserWithPlan(userId);

    // If user has no plan assigned, return the trial plan as default
    if (!user?.plan) {
      const trialPlan = await this.repository.findUnique({ name: "trial" });
      return trialPlan;
    }

    return user.plan;
  }

  async canUserCreateIntegration(
    userId: string
  ): Promise<{ canCreate: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId);

    if (!userPlan) {
      return { canCreate: false, reason: "No active plan found" };
    }

    const userIntegrationCount =
      await this.repository.getUserIntegrationCount(userId);

    if (userIntegrationCount >= userPlan.maxIntegrations) {
      return {
        canCreate: false,
        reason: `Plan limit reached. Maximum ${userPlan.maxIntegrations} integrations allowed on ${userPlan.name} plan`,
      };
    }

    return { canCreate: true };
  }

  async canUserCreateTrackedKeyword(
    userId: string
  ): Promise<{ canCreate: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId);

    if (!userPlan) {
      return { canCreate: false, reason: "No active plan found" };
    }

    const userKeywordCount =
      await this.repository.getUserTrackedKeywordCount(userId);

    if (userKeywordCount >= userPlan.maxTrackedKeywords) {
      return {
        canCreate: false,
        reason: `Plan limit reached. Maximum ${userPlan.maxTrackedKeywords} tracked keywords allowed on ${userPlan.name} plan`,
      };
    }

    return { canCreate: true };
  }

  async canUserCreateCompetitor(
    userId: string
  ): Promise<{ canCreate: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId);

    if (!userPlan) {
      return { canCreate: false, reason: "No active plan found" };
    }

    const userCompetitorCount = 
      await this.repository.getUserCompetitorCount(userId);

    if (userCompetitorCount >= userPlan.maxCompetitors) {
      return {
        canCreate: false,
        reason: `Plan limit reached. Maximum ${userPlan.maxCompetitors} competitors allowed on ${userPlan.name} plan`,
      };
    }

    return { canCreate: true };
  }

  async getPlanFeatures(userId: string): Promise<Record<string, any> | null> {
    const userPlan = await this.getUserPlan(userId);

    if (!userPlan || !userPlan.features) {
      return null;
    }

    return userPlan.features as Record<string, any>;
  }

  async hasFeature(userId: string, featureName: string): Promise<boolean> {
    const features = await this.getPlanFeatures(userId);

    if (!features) {
      return false;
    }

    return Boolean(features[featureName]);
  }

  async getPlanUsageStats(userId: string): Promise<{
    integrations: { current: number; max: number };
    trackedKeywords: { current: number; max: number };
    competitors: { current: number; max: number };
    tokens: { current: number; max: number; periodEnd: Date | null };
  } | null> {
    const userPlan = await this.getUserPlan(userId);

    if (!userPlan) {
      return null;
    }

    const [integrationCount, keywordCount, competitorCount, tokenUsage] = await Promise.all([
      this.repository.getUserIntegrationCount(userId),
      this.repository.getUserTrackedKeywordCount(userId),
      this.repository.getUserCompetitorCount(userId),
      this.repository.getUserTokenUsage(userId),
    ]);

    return {
      integrations: {
        current: integrationCount,
        max: userPlan.maxIntegrations,
      },
      trackedKeywords: {
        current: keywordCount,
        max: userPlan.maxTrackedKeywords,
      },
      competitors: {
        current: competitorCount,
        max: userPlan.maxCompetitors,
      },
      tokens: {
        current: tokenUsage.current,
        max: userPlan.monthlyTokenAllowance || 0,
        periodEnd: tokenUsage.periodEnd,
      },
    };
  }

  async trackTokenUsage(userId: string, tokenCount: number): Promise<{ 
    success: boolean; 
    usage: number; 
    limit: number; 
    isOverage: boolean;
  }> {
    const userPlan = await this.getUserPlan(userId);
    
    if (!userPlan) {
      throw new Error("No active plan found for user");
    }

    // Check if user has a billing cycle initialized
    const tokenUsage = await this.repository.getUserTokenUsage(userId);
    
    if (!tokenUsage.periodEnd) {
      // Initialize billing cycle if not set
      await this.repository.initializeBillingCycle(userId);
    } else {
      // Check if billing period has ended and reset if needed
      const now = new Date();
      if (now > tokenUsage.periodEnd) {
        const newPeriodEnd = new Date(now);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        await this.repository.resetTokenUsage(userId, newPeriodEnd);
      }
    }

    // Increment token usage
    await this.repository.incrementTokenUsage(userId, tokenCount);
    
    // Get updated usage
    const updatedUsage = await this.repository.getUserTokenUsage(userId);
    const newUsage = updatedUsage.current;
    const limit = userPlan.monthlyTokenAllowance || 0;
    
    return {
      success: true,
      usage: newUsage,
      limit: limit,
      isOverage: newUsage > limit,
    };
  }

  async getTokenUsageStatus(userId: string): Promise<{
    current: number;
    limit: number;
    periodEnd: Date | null;
    isOverage: boolean;
    percentage: number;
  } | null> {
    const userPlan = await this.getUserPlan(userId);
    
    if (!userPlan) {
      return null;
    }

    const tokenUsage = await this.repository.getUserTokenUsage(userId);
    const limit = userPlan.monthlyTokenAllowance || 0;
    const current = tokenUsage.current;
    
    return {
      current,
      limit,
      periodEnd: tokenUsage.periodEnd,
      isOverage: current > limit,
      percentage: limit > 0 ? (current / limit) * 100 : 0,
    };
  }
}
