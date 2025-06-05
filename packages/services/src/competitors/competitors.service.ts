import { Competitor, CompetitorSentiment, MentionSource } from "@repo/db";
import { CompetitorRepository } from "./competitors.repository";

export class CoreCompetitorService {
  constructor(private repository: CompetitorRepository) {}

  async createCompetitor(data: {
    name: string;
    userId: string;
  }): Promise<Competitor> {
    // Check if competitor already exists
    const existing = await this.repository.getCompetitorByUserAndName(
      data.userId,
      data.name
    );

    if (existing) {
      throw new Error("Competitor with this name already exists");
    }

    return this.repository.createCompetitor(data);
  }

  async getUserCompetitors(userId: string): Promise<Competitor[]> {
    return this.repository.getUserCompetitors(userId);
  }

  async getUserCompetitorCount(userId: string): Promise<number> {
    return this.repository.getUserCompetitorCount(userId);
  }

  async deleteCompetitor(competitorId: number, userId: string): Promise<void> {
    const competitor = await this.repository.getCompetitorById(competitorId);
    
    if (!competitor || competitor.userId !== userId) {
      throw new Error("Competitor not found or access denied");
    }

    await this.repository.deleteCompetitor(competitorId);
  }

  async getCompetitorSentimentData(
    competitorId: number,
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CompetitorSentiment[]> {
    const competitor = await this.repository.getCompetitorById(competitorId);
    
    if (!competitor || competitor.userId !== userId) {
      throw new Error("Competitor not found or access denied");
    }

    return this.repository.getCompetitorSentimentData(
      competitorId,
      startDate,
      endDate
    );
  }

  async addCompetitorSentimentData(data: {
    competitorId: number;
    score: number;
    sourceType: MentionSource;
    mentionCount: number;
    date?: Date;
  }): Promise<CompetitorSentiment> {
    return this.repository.createCompetitorSentiment({
      ...data,
      sourceType: data.sourceType as string,
    });
  }

  // Method to simulate fetching competitor sentiment from external sources
  async collectCompetitorSentiment(competitorName: string): Promise<{
    score: number;
    sourceType: MentionSource;
    mentionCount: number;
  }[]> {
    // This is a placeholder implementation that would normally:
    // 1. Query external APIs (Twitter, Reddit, YouTube, etc.)
    // 2. Analyze sentiment of mentions
    // 3. Return aggregated sentiment data
    
    // For MVP, return mock data
    const sources: MentionSource[] = ['YOUTUBE', 'REDDIT', 'FACEBOOK', 'INSTAGRAM'];
    
    return sources.map(source => ({
      score: Math.random() * 2 - 1, // Random score between -1 and 1
      sourceType: source,
      mentionCount: Math.floor(Math.random() * 100) + 1,
    }));
  }

  async updateCompetitorSentimentDaily(competitorId: number): Promise<void> {
    const competitor = await this.repository.getCompetitorById(competitorId);
    
    if (!competitor) {
      throw new Error("Competitor not found");
    }

    const sentimentData = await this.collectCompetitorSentiment(competitor.name);
    
    for (const data of sentimentData) {
      try {
        await this.repository.createCompetitorSentiment({
          competitorId,
          score: data.score,
          sourceType: data.sourceType as string,
          mentionCount: data.mentionCount,
          date: new Date(),
        });
      } catch (error) {
        // Skip if data already exists for this day/source combination
        console.log(`Sentiment data already exists for ${competitor.name} on ${new Date().toISOString()}`);
      }
    }
  }
}