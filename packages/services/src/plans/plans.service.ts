import { prisma } from "database";
import { PLAN_TYPE } from "./plan.type";
import { PlanRepository, planRepository } from "./plan.repository";
class PlanService {
  constructor(private planRepository: PlanRepository) {
    this.planRepository = planRepository;
  }
  async getPlans() {
    return await this.planRepository.getPlans();
  }

  async getPlanByName(name: PLAN_TYPE) {
    return await this.planRepository.getPlanByName(name);
  }

  async updatePlan(userId: string, planId: string) {
    return await this.planRepository.updatePlan(userId, planId);
  }
}

export const planService = new PlanService(planRepository);
