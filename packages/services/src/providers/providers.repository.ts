import { Provider } from "@repo/db";
import { BaseRepository } from "../common/base.repository";

export class ProviderRepository extends BaseRepository<Provider, string> {
  constructor(prisma: any) {
    super(prisma, "provider");
  }

  async findById(id: string): Promise<Provider | null> {
    console.log("FINDING PROVIDER BY ID: ", id);
    try {
      return await this.prisma.provider.findUnique({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Provider[]> {
    return this.findMany({ userId });
  }

  async findByName(name: string): Promise<Provider | null> {
    return this.findUnique({ name });
  }
}
