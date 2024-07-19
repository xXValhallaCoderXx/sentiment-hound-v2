import { prisma } from "database";

export class ProvidersRepository {
  async getProviders() {
    return await prisma.provider.findMany();
  }

  async getProviderById(id: string) {
    return await prisma.provider.findUnique({ where: { id: parseInt(id) } });
  }

  async getProviderByName(name: string) {
    return await prisma.provider.findFirst({ where: { name } });
  }
}

export const providersRepository = new ProvidersRepository();
