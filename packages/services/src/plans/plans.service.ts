import { Plan } from "@repo/db";
import { PlanRepository } from "./plans.repository";

export class CorePlanService {
  constructor(private repository: PlanRepository) {}

  getPlans(): Promise<Plan[]> {
    return this.repository.findAll();
  }
}
