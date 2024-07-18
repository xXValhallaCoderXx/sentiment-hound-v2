import { prisma } from "database";
import { PLAN_TYPE } from "./plan.type";

class PlanService {
  async getPlans() {
    return await prisma.plan.findMany();
  }

  async getPlanByName(name: PLAN_TYPE) {
    return await prisma.plan.findFirst({
      where: {
        name,
      },
    });
  }

  async updatePlan(userId: string, planId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        plan: {
          connect: { id: parseInt(planId) },
        },
      },
    });
  }
}

export const planService = new PlanService();
