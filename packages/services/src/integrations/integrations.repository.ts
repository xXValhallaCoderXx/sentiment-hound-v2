import { BaseRepository } from "../common/base.repository";
import { Integration, PrismaClient, Prisma } from "@repo/db";

export class IntegrationRepository extends BaseRepository<"integration"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "integration");
  }

  async findByUserId(
    userId: string,
    args?: Omit<Prisma.IntegrationFindManyArgs, "where">
  ): Promise<Integration[]> {
    return this.findMany({ userId }, args);
  }

  async findByProviderIdAndUserId(
    providerId: number,
    userId: string,
    args?: Omit<Prisma.IntegrationFindFirstArgs, "where">
  ): Promise<Integration | null> {
    return this.findFirst({ providerId, userId }, args);
  }

  async findByUserIdAndProviderName(
    userId: string,
    providerName: string,
    args?: Omit<Prisma.IntegrationFindFirstArgs, "where">
  ): Promise<Integration | null> {
    return this.findFirst(
      {
        userId,
        provider: { name: providerName },
      },
      {
        include: { provider: true },
        ...args,
      }
    );
  }

  async update(
    id: number,
    data: Prisma.IntegrationUpdateInput,
    args?: Omit<Prisma.IntegrationUpdateArgs, "where" | "data">
  ): Promise<Integration> {
    return super.update(id, data, args);
  }
}
