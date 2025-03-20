import { Provider } from "@repo/db";
import { BaseRepository } from "../common/base.repository";


export class ProviderRepository extends BaseRepository<"provider"> {
  constructor(prisma: any) {
    super(prisma, "provider");
  }

  async findById(id: string): Promise<Provider | null> {
    try {
      return await super.findUnique({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.log("ERROR: ", error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Provider[]> {
    return super.findMany({ userId });
  }

  async findByName(name: string): Promise<Provider | null> {
    return super.findUnique({ name });
  }
}
