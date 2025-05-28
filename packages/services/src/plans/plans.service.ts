import { Plan, Prisma } from "@repo/db";
import { PlanRepository } from "./plans.repository";

export class CorePlanService {
  constructor(private repository: PlanRepository) {}

  getPlans(): Promise<Plan[]> {
    return this.repository.findAll();
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

}
