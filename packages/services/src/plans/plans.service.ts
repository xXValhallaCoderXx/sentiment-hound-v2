import { Plan, Prisma, User } from "@repo/db";
import { PlanRepository } from "./plans.repository";

export class CorePlanService {
  constructor(private repository: PlanRepository) {}

  getPlans(): Promise<Plan[]> {
    return this.repository.findAll({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });
  }

  addUserToPlan(
    id: string | number,
    userId: string,
  ): Promise<Plan> {
    return this.repository.update(id, {
      users: {
        connect: { id: userId },
      },
    });
  }
  
  removeUserFromPlan(
    id: string | number,
    userId: string,
  ): Promise<Plan> {
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
    return this.repository.update(id, data, args);
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
      const trialPlan = await this.repository.findUnique({ name: 'trial' });
      return trialPlan;
    }
    
    return user.plan;
  }

  async canUserCreateIntegration(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId);
    
    if (!userPlan) {
      return { canCreate: false, reason: "No active plan found" };
    }

    const userIntegrationCount = await this.repository.getUserIntegrationCount(userId);
    
    if (userIntegrationCount >= userPlan.maxIntegrations) {
      return { 
        canCreate: false, 
        reason: `Plan limit reached. Maximum ${userPlan.maxIntegrations} integrations allowed on ${userPlan.name} plan` 
      };
    }

    return { canCreate: true };
  }

  async canUserCreateTrackedKeyword(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId);
    
    if (!userPlan) {
      return { canCreate: false, reason: "No active plan found" };
    }

    const userKeywordCount = await this.repository.getUserTrackedKeywordCount(userId);
    
    if (userKeywordCount >= userPlan.maxTrackedKeywords) {
      return { 
        canCreate: false, 
        reason: `Plan limit reached. Maximum ${userPlan.maxTrackedKeywords} tracked keywords allowed on ${userPlan.name} plan` 
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
  } | null> {
    const userPlan = await this.getUserPlan(userId);
    
    if (!userPlan) {
      return null;
    }

    const [integrationCount, keywordCount] = await Promise.all([
      this.repository.getUserIntegrationCount(userId),
      this.repository.getUserTrackedKeywordCount(userId)
    ]);

    return {
      integrations: {
        current: integrationCount,
        max: userPlan.maxIntegrations
      },
      trackedKeywords: {
        current: keywordCount,
        max: userPlan.maxTrackedKeywords
      }
    };
  }
}
