import { Plan, PrismaClient, Prisma } from "@repo/db";

export class PlanRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.PlanCreateArgs): Promise<Plan> {
    return this.prisma.plan.create(args);
  }

  async createMany(args: Prisma.PlanCreateManyArgs) {
    return this.prisma.plan.createMany(args);
  }

  async findAll(args?: Prisma.PlanFindManyArgs): Promise<Plan[]> {
    return this.prisma.plan.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.PlanFindUniqueArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.plan.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.PlanWhereUniqueInput,
    args?: Omit<Prisma.PlanFindUniqueArgs, "where">
  ) {
    return this.prisma.plan.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.PlanWhereInput,
    args?: Omit<Prisma.PlanFindFirstArgs, "where">
  ) {
    return this.prisma.plan.findFirst({
      where,
      ...args,
    });
  }

  async findMany(args: Prisma.PlanFindManyArgs) {
    return this.prisma.plan.findMany(args);
  }

  async update(
    id: string | number,
    data: Prisma.PlanUpdateInput,
    args?: Omit<Prisma.PlanUpdateArgs, "where" | "data">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.plan.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.PlanDeleteArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.plan.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.PlanWhereInput,
    args?: Omit<Prisma.PlanCountArgs, "where">
  ) {
    return this.prisma.plan.count({
      where,
      ...args,
    });
  }

  async findUserWithPlan(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });
  }

  async getUserIntegrationCount(userId: string): Promise<number> {
    return this.prisma.integration.count({
      where: { userId, isActive: true },
    });
  }

  async getUserTrackedKeywordCount(userId: string): Promise<number> {
    return this.prisma.trackedKeyword.count({
      where: { userId, isActive: true },
    });
  }

  async getUserCompetitorCount(userId: string): Promise<number> {
    // Stub implementation - would use Prisma when available
    return 0;
  }

  async getUserTokenUsage(userId: string): Promise<{ current: number; periodEnd: Date | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenUsageThisPeriod: true, currentPeriodEnd: true },
    });

    return {
      current: user?.tokenUsageThisPeriod || 0,
      periodEnd: user?.currentPeriodEnd || null,
    };
  }

  async incrementTokenUsage(userId: string, tokenCount: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenUsageThisPeriod: {
          increment: tokenCount,
        },
      },
    });
  }

  async resetTokenUsage(userId: string, newPeriodEnd: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenUsageThisPeriod: 0,
        currentPeriodEnd: newPeriodEnd,
      },
    });
  }

  async initializeBillingCycle(userId: string): Promise<void> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1); // Set to one month from now

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentPeriodEnd: periodEnd,
        tokenUsageThisPeriod: 0,
      },
    });
  }
}
