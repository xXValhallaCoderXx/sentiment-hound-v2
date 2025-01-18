import { prisma } from "database";
import {
  ICreateIntegrationDTO,
  IUpdateCredentialsDTO,
} from "./intefrations.dto";

export class IntegrationsRepository {
  async getProviders() {
    return await prisma.user.findMany();
  }

  async findFirst(where: any) {
    return await prisma.integration.findFirst({ where });
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
      include: { provider: true },
    });
  }

  async deleteUserIntegration(userId: string, providerId: string) {
    // return prisma.integration.deleteMany({
    //   where: { userId, providerId: parseInt(providerId) },
    // });

    return prisma.$transaction(async (tx) => {
      // First delete all related tasks
      await tx.task.deleteMany({
        where: {
          integration: {
            userId,

            providerId: parseInt(providerId),
          },
        },
      });

      // Then delete the integration
      return tx.integration.deleteMany({
        where: {
          userId,
          providerId: parseInt(providerId),
        },
      });
    });
  }

  async createIntegration(data: ICreateIntegrationDTO) {
    const { providerId, remoteId, accessToken, refreshToken } = data;
    await prisma.integration.create({
      data: {
        provider: {
          connect: {
            id: providerId,
          },
        },
        accountId: remoteId,
        accessToken,
        refreshToken,
        refreshTokenExpiresAt: data.refreshTokenExpiry,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  async updateIntegrationAuthCredentials(data: IUpdateCredentialsDTO) {
    // Update the integration credentials
    await prisma.integration.update({
      where: {
        id: data?.providerId,
        userId: data?.userId,
      },
      data: {
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        refreshTokenExpiresAt: data?.accessTokenExpiry,
      },
    });
  }
}

export const integrationsRepository = new IntegrationsRepository();
