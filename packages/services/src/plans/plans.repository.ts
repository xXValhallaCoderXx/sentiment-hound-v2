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
}
