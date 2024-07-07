import { prisma } from "database";

class IntegrationsService {
  async getProviders() {
    return await prisma.user.findMany();
  }

  async getUserIntegrations(userId: string) {
    // console.log("Fetching revenue data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    return prisma.integration.findMany({
      where: { userId },
    });
  }

  async deleteUserIntegration(userId: string, providerId: string) {
    return prisma.integration.deleteMany({
      where: { userId, providerId: parseInt(providerId) },
    });
  }
}

export const integrationsService = new IntegrationsService();
