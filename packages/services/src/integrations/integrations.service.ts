import { prisma, TaskStatus, TaskType, JobStatus, User } from "database";

class IntegrationsService {
  async getProviders() {
    return await prisma.user.findMany();
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
