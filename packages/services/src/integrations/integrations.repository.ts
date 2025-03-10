import { BaseRepository } from "../common/base.repository";
import { Integration } from "@repo/db";
export class IntegrationRepository extends BaseRepository<Integration, number> {
  constructor(prisma: any) {
    super(prisma, "integration");
  }

  async findByUserId(userId: string): Promise<Integration[]> {
    return this.findMany({ userId }, { provider: true });
  }

  async findByUserIdAndProviderName(
    userId: string,
    providerName: string
  ): Promise<Integration | null> {
    return this.findFirst({ userId, provider: { name: providerName } });
  }
}
