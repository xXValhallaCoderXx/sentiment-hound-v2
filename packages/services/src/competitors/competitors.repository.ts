import { PrismaClient, Competitor, CompetitorSentiment } from "@repo/db";

export class CompetitorRepository {
  constructor(private prisma: PrismaClient) {}

  async createCompetitor(data: {
    name: string;
    userId: string;
  }): Promise<Competitor> {
    return this.prisma.competitor.create({
      data,
    });
  }

  async getUserCompetitors(userId: string): Promise<Competitor[]> {
    return this.prisma.competitor.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUserCompetitorCount(userId: string): Promise<number> {
    return this.prisma.competitor.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async getCompetitorById(id: number): Promise<Competitor | null> {
    return this.prisma.competitor.findUnique({
      where: { id },
    });
  }

  async deleteCompetitor(id: number): Promise<Competitor> {
    return this.prisma.competitor.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCompetitorSentimentData(
    competitorId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<CompetitorSentiment[]> {
    return this.prisma.competitorSentiment.findMany({
      where: {
        competitorId,
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async createCompetitorSentiment(data: {
    competitorId: number;
    score: number;
    sourceType: string;
    mentionCount: number;
    date?: Date;
  }): Promise<CompetitorSentiment> {
    return this.prisma.competitorSentiment.create({
      data: {
        ...data,
        date: data.date || new Date(),
      },
    });
  }

  async getCompetitorByUserAndName(
    userId: string,
    name: string
  ): Promise<Competitor | null> {
    return this.prisma.competitor.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
        isActive: true,
      },
    });
  }
}