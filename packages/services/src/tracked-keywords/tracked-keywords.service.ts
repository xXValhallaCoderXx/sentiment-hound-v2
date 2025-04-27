import { prisma, Prisma } from "@repo/db";

export class TrackedKeywordService {
  async createKeyword(data: {
    userId: string;
    providerId: number;
    keyword: string;
  }) {
    return prisma.trackedKeyword.create({
      data: {
        userId: data.userId,
        providerId: data.providerId,
        keyword: data.keyword,
      },
    });
  }

  async getKeywordsForUser(userId: string) {
    return prisma.trackedKeyword.findMany({
      where: { userId },
      include: {
        provider: true,
        Mention: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateKeyword(
    id: number,
    data: Partial<{ keyword: string; isActive: boolean }>
  ) {
    return prisma.trackedKeyword.update({
      where: { id },
      data,
    });
  }

  async deleteKeyword(id: number) {
    return prisma.trackedKeyword.delete({
      where: { id },
    });
  }

  async findByUserAndProvider(userId: string, providerId: number) {
    return prisma.trackedKeyword.findMany({
      where: {
        userId,
        providerId,
      },
    });
  }

  async findActiveForProvider(providerName: string) {
    return prisma.trackedKeyword.findMany({
      where: {
        isActive: true,
        provider: {
          name: providerName,
        },
      },
      include: {
        user: true,
      },
    });
  }
}

export const trackedKeywordService = new TrackedKeywordService();
