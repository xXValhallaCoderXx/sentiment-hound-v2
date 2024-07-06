import { prisma } from "database";


class PlanService {
  async getPlans() {
    return await prisma.plan.findMany();
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
