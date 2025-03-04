import { Provider } from "@repo/db";
import { IProviderRepository } from "./providers.interface";

export class ProviderRepository implements IProviderRepository {
  constructor(private prisma: any) {}

  async create(provider: Partial<Provider>): Promise<Provider> {
    return this.prisma.provider.create({ data: provider });
  }

  async findById(id: string): Promise<Provider | null> {
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
    return this.prisma.provider.findMany({ where: { userId } });
  }

  async update(id: string, data: Partial<Provider>): Promise<Provider> {
    return this.prisma.provider.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.provider.delete({ where: { id } });
  }

  async findAll(): Promise<Provider[]> {
    return this.prisma.provider.findMany();
  }

  async findByName(name: string): Promise<Provider | null> {
    return this.prisma.provider.findUnique({ where: { name } });
  }
}
