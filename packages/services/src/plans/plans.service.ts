import { prisma } from "database";

class PlanService {
  async getPlans() {
    return await prisma.plan.findMany();
  }
}

export const planService = new PlanService();
