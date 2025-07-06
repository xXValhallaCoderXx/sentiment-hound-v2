import { describe, it, expect, beforeEach, vi } from "vitest";
import { CoreMentionService } from "./mentions.service";

// Mock dependencies
const mockRepository = {
  create: vi.fn(),
  createMany: vi.fn(),
  findById: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
  update: vi.fn(),
};

// Mock prisma
vi.mock("@repo/db", () => ({
  prisma: {
    aspectAnalysis: {
      createMany: vi.fn(),
    },
  },
  SentimentStatus: {
    COMPLETED: "COMPLETED",
    PENDING: "PENDING",
  },
}));

describe("CoreMentionService", () => {
  let mentionService: CoreMentionService;

  beforeEach(() => {
    vi.clearAllMocks();
    mentionService = new CoreMentionService(mockRepository as any);
  });

  describe("getUserMentionsWithFilters", () => {
    it("should filter mentions by providerId using direct provider relationship", async () => {
      const filterParams = {
        userId: "user123",
        providerId: 1,
        page: 1,
        pageSize: 10,
      };

      const mockMentions = [
        {
          id: 1,
          content: "Great video!",
          sentiment: "POSITIVE",
          createdAt: new Date("2024-01-01"),
          post: {
            provider: { name: "YouTube" },
          },
          provider: { name: "YouTube" },
          aspectAnalyses: [
            { aspect: "quality", sentiment: "positive" },
          ],
        },
      ];

      mockRepository.findMany.mockResolvedValue(mockMentions);
      mockRepository.count.mockResolvedValue(1);

      const result = await mentionService.getUserMentionsWithFilters(filterParams);

      // Verify the query uses OR condition to support both direct and integration-based provider filtering
      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              post: {
                userId: "user123",
                providerId: 1,
              },
            },
            {
              post: {
                userId: "user123",
                integration: {
                  providerId: 1,
                },
              },
            },
          ],
        },
        include: {
          post: {
            include: {
              provider: true,
              integration: {
                include: {
                  provider: true,
                },
              },
            },
          },
          provider: true,
          aspectAnalyses: true,
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.provider).toBe("YouTube");
      expect(result.total).toBe(1);
    });

    it("should work without providerId filter", async () => {
      const filterParams = {
        userId: "user123",
        page: 1,
        pageSize: 10,
      };

      const mockMentions = [
        {
          id: 1,
          content: "Test comment",
          sentiment: "NEUTRAL",
          createdAt: new Date(),
          post: {
            integration: {
              provider: { name: "Reddit" },
            },
          },
          aspectAnalyses: [],
        },
      ];

      mockRepository.findMany.mockResolvedValue(mockMentions);
      mockRepository.count.mockResolvedValue(1);

      const result = await mentionService.getUserMentionsWithFilters(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          post: {
            userId: "user123",
          },
        },
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(result.data).toHaveLength(1);
    });

    it("should resolve provider name with fallback logic", async () => {
      const filterParams = {
        userId: "user123",
        page: 1,
        pageSize: 10,
      };

      const testCases = [
        {
          name: "direct mention provider",
          mention: {
            id: 1,
            content: "Test",
            sentiment: "POSITIVE",
            createdAt: new Date(),
            provider: { name: "YouTube" },
            post: null,
            aspectAnalyses: [],
          },
          expectedProvider: "YouTube",
        },
        {
          name: "direct post provider",
          mention: {
            id: 2,
            content: "Test",
            sentiment: "POSITIVE",
            createdAt: new Date(),
            provider: null,
            post: { provider: { name: "Reddit" } },
            aspectAnalyses: [],
          },
          expectedProvider: "Reddit",
        },
        {
          name: "integration provider fallback",
          mention: {
            id: 3,
            content: "Test",
            sentiment: "POSITIVE",
            createdAt: new Date(),
            provider: null,
            post: {
              provider: null,
              integration: { provider: { name: "LinkedIn" } },
            },
            aspectAnalyses: [],
          },
          expectedProvider: "LinkedIn",
        },
        {
          name: "no provider found",
          mention: {
            id: 4,
            content: "Test",
            sentiment: "POSITIVE",
            createdAt: new Date(),
            provider: null,
            post: {
              provider: null,
              integration: null,
            },
            aspectAnalyses: [],
          },
          expectedProvider: "unknown",
        },
      ];

      for (const testCase of testCases) {
        mockRepository.findMany.mockResolvedValue([testCase.mention]);
        mockRepository.count.mockResolvedValue(1);

        const result = await mentionService.getUserMentionsWithFilters(filterParams);

        expect(result.data[0]?.provider).toBe(testCase.expectedProvider);
      }
    });

    it("should filter by sentiment when specified", async () => {
      const filterParams = {
        userId: "user123",
        sentiment: "POSITIVE",
        page: 1,
        pageSize: 10,
      };

      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      await mentionService.getUserMentionsWithFilters(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          post: {
            userId: "user123",
          },
          sentiment: "POSITIVE",
        },
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should filter by aspect when specified", async () => {
      const filterParams = {
        userId: "user123",
        aspect: "quality",
        page: 1,
        pageSize: 10,
      };

      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      await mentionService.getUserMentionsWithFilters(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          post: {
            userId: "user123",
          },
          aspectAnalyses: {
            some: {
              aspect: "quality",
            },
          },
        },
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should support combined filters", async () => {
      const filterParams = {
        userId: "user123",
        providerId: 1,
        sentiment: "POSITIVE",
        aspect: "quality",
        page: 1,
        pageSize: 10,
      };

      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      await mentionService.getUserMentionsWithFilters(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              post: {
                userId: "user123",
                providerId: 1,
              },
            },
            {
              post: {
                userId: "user123",
                integration: {
                  providerId: 1,
                },
              },
            },
          ],
          sentiment: "POSITIVE",
          aspectAnalyses: {
            some: {
              aspect: "quality",
            },
          },
        },
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  describe("createMention", () => {
    it("should create mention with proper data structure", async () => {
      const mentionData = {
        data: {
          remoteId: "mention123",
          sourceType: "YOUTUBE",
          content: "Great video!",
          postId: 1,
          providerId: 1, // Optional providerId
        },
      };

      const expectedMention = {
        id: 1,
        remoteId: "mention123",
        sourceType: "YOUTUBE",
        content: "Great video!",
        postId: 1,
        providerId: 1,
      };

      mockRepository.create.mockResolvedValue(expectedMention);

      const result = await mentionService.createMention(mentionData as any);

      expect(mockRepository.create).toHaveBeenCalledWith(mentionData);
      expect(result).toEqual(expectedMention);
    });
  });

  describe("backward compatibility", () => {
    it("should work with mentions that don't have direct providerId", async () => {
      const filterParams = {
        userId: "user123",
        page: 1,
        pageSize: 10,
      };

      const mockMentions = [
        {
          id: 1,
          content: "Old mention",
          sentiment: "NEUTRAL",
          createdAt: new Date(),
          provider: null, // No direct provider
          post: {
            provider: null, // No direct post provider
            integration: {
              provider: { name: "YouTube" }, // Only integration provider
            },
          },
          aspectAnalyses: [],
        },
      ];

      mockRepository.findMany.mockResolvedValue(mockMentions);
      mockRepository.count.mockResolvedValue(1);

      const result = await mentionService.getUserMentionsWithFilters(filterParams);

      expect(result.data[0]?.provider).toBe("YouTube");
      expect(result.data).toHaveLength(1);
    });
  });
});
