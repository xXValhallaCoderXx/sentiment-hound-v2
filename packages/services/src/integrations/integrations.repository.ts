import { prisma } from "database";

export class IntegrationsRepository {
  async getProviders() {
    return await prisma.user.findMany();
  }

  async getUserIntegrations(userId: string) {
    return prisma.integration.findMany({
      where: { userId },
      include: { provider: true },
    });
  }

  async getUserIntegration(userId: string, name: string) {
    return prisma.integration.findFirst({
      where: { userId, provider: { name } },
    });
  }

  async deleteUserIntegration(userId: string, providerId: string) {
    return prisma.integration.deleteMany({
      where: { userId, providerId: parseInt(providerId) },
    });
  }
}

export const integrationsRepository = new IntegrationsRepository();
