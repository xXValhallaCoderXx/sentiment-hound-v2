import { prisma, TaskStatus, TaskType, JobStatus, User } from "database";

class ProviderService {
  async getProviders() {
    return await prisma.provider.findMany();
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

export const providersService = new ProviderService();
