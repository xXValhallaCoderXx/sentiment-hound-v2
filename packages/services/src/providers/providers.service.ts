import { prisma } from "database";

class ProviderService {
  async getProviders() {
    return await prisma.provider.findMany();
  }

  async getProviderById(id: string) {
    return await prisma.provider.findUnique({ where: { id: parseInt(id) } });
  }

  async getProviderByName(name: string) {
    return await prisma.provider.findFirst({ where: { name } });
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
