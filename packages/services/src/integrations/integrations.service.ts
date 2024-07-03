import { prisma, TaskStatus, TaskType, JobStatus, User } from "database";

class IntegrationsService {
  async getProviders() {
    return await prisma.user.findMany();
  }

  async getUserIntegrations(userId: string) {
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return prisma.integration.findMany({
      where: { userId },
    });
  }

  // async integrateSocialAccount(
  //   userId: string,
  //   provider: string,
  //   accountId: string,
  //   accessToken: string
  // ) {
  //   return prisma.socialAccount.create({
  //     data: {
  //       provider,
  //       accountId,
  //       accessToken,
  //       user: { connect: { id: userId } },
  //     },
  //   });
  // }
}

export const integrationsService = new IntegrationsService();
