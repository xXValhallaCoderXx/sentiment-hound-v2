import { describe, it, expect, beforeEach, vi } from "vitest";
import { TaskType } from "@repo/db";
import { Provider } from "../url-parser";

// Mock the service imports using factory functions
vi.mock("..", () => ({
  providerService: {
    getProviderByName: vi.fn(),
  },
  urlParserService: {
    parse: vi.fn(),
  },
  integrationsService: {
    getUserIntegrationByName: vi.fn(),
  },
  subtaskService: {
    createSubTask: vi.fn(),
  },
}));

// Import after mocking
import { CoreTaskService } from "./tasks.service";
import {
  providerService,
  urlParserService,
  integrationsService,
  subtaskService,
} from "..";

describe("CoreTaskService", () => {
  let taskService: CoreTaskService;

  // Mock prisma
  const mockPrisma = {
    task: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    integration: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    taskService = new CoreTaskService(mockPrisma as any);
  });

  describe("createTask", () => {
    const baseTaskData = {
      userId: "user123",
      taskType: TaskType.ANALYZE_POST,
      extraData: {
        url: "https://www.youtube.com/watch?v=test123",
        token: "test-api-key",
      },
    };

    it("should create task with providerId and null integrationId for API key authentication", async () => {
      // Setup mocks
      vi.mocked(urlParserService.parse).mockReturnValue({
        provider: Provider.YOUTUBE,
        url: "https://www.youtube.com/watch?v=test123",
        metadata: { videoId: "test123" },
      });

      vi.mocked(providerService.getProviderByName).mockResolvedValue({
        id: 1,
        name: "YouTube",
      } as any);

      mockPrisma.task.create.mockResolvedValue({
        id: 1,
        type: TaskType.ANALYZE_POST,
        userId: "user123",
        providerId: 1,
        integrationId: null,
        status: "PENDING",
      });

      vi.mocked(subtaskService.createSubTask).mockResolvedValue({} as any);

      // Execute
      const result = await taskService.createTask({
        ...baseTaskData,
        integrationId: null, // API key auth
        providerId: 1,
      });

      // Verify - should NOT call getProviderByName since providerId is provided
      expect(
        vi.mocked(providerService.getProviderByName),
      ).not.toHaveBeenCalled();
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          type: TaskType.ANALYZE_POST,
          userId: "user123",
          providerId: 1,
          status: "PENDING",
        },
      });
      expect(result.id).toBe(1);
    });

    it("should create task with both providerId and integrationId for user integration authentication", async () => {
      // Setup mocks
      vi.mocked(urlParserService.parse).mockReturnValue({
        provider: Provider.YOUTUBE,
        url: "https://www.youtube.com/watch?v=test123",
        metadata: { videoId: "test123" },
      });

      vi.mocked(providerService.getProviderByName).mockResolvedValue({
        id: 1,
        name: "YouTube",
      } as any);

      vi.mocked(integrationsService.getUserIntegrationByName).mockResolvedValue(
        {
          id: 5,
          provider: { name: "youtube" },
          accessToken: "user-oauth-token",
          isActive: true,
        } as any,
      );

      mockPrisma.task.create.mockResolvedValue({
        id: 2,
        type: TaskType.ANALYZE_POST,
        userId: "user123",
        providerId: 1,
        integrationId: 5,
        status: "PENDING",
      });

      vi.mocked(subtaskService.createSubTask).mockResolvedValue({} as any);

      // Execute
      const result = await taskService.createTask({
        ...baseTaskData,
        integrationId: 5,
        providerId: 1,
      });

      // Verify
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          type: TaskType.ANALYZE_POST,
          userId: "user123",
          providerId: 1,
          integrationId: 5,
          status: "PENDING",
        },
      });
      expect(result.id).toBe(2);
    });

    it("should resolve providerId from URL when not provided", async () => {
      // Setup mocks
      vi.mocked(urlParserService.parse).mockReturnValue({
        provider: Provider.REDDIT,
        url: "https://www.reddit.com/r/test/comments/abc123/test/",
        metadata: { subreddit: "test", postId: "abc123" },
      });

      vi.mocked(providerService.getProviderByName).mockResolvedValue({
        id: 2,
        name: "Reddit",
      } as any);

      mockPrisma.task.create.mockResolvedValue({
        id: 3,
        type: TaskType.ANALYZE_POST,
        userId: "user123",
        providerId: 2,
        integrationId: null,
        status: "PENDING",
      });

      vi.mocked(subtaskService.createSubTask).mockResolvedValue({} as any);

      // Execute
      const result = await taskService.createTask({
        userId: "user123",
        taskType: TaskType.ANALYZE_POST,
        integrationId: null,
        extraData: {
          url: "https://www.reddit.com/r/test/comments/abc123/test/",
          token: "reddit-api-key",
        },
      });

      // Verify provider resolution
      expect(vi.mocked(urlParserService.parse)).toHaveBeenCalledWith(
        "https://www.reddit.com/r/test/comments/abc123/test/",
      );
      expect(vi.mocked(providerService.getProviderByName)).toHaveBeenCalledWith(
        "reddit",
      );
      expect(result.id).toBe(3);
    });

    it("should throw error when provider resolution fails", async () => {
      // Setup mocks
      vi.mocked(urlParserService.parse).mockReturnValue({
        provider: "unsupported" as Provider,
        url: "https://unsupported.com/post/123",
        metadata: {},
      });

      vi.mocked(providerService.getProviderByName).mockRejectedValue(
        new Error("Provider 'unsupported' not found"),
      );

      // Execute & Verify
      await expect(
        taskService.createTask({
          userId: "user123",
          taskType: TaskType.ANALYZE_POST,
          integrationId: null,
          extraData: {
            url: "https://unsupported.com/post/123",
            token: "test-token",
          },
        }),
      ).rejects.toThrow("Unsupported provider: unsupported");
    });

    it("should resolve providerId from integrationId when URL parsing fails", async () => {
      // Setup mocks
      vi.mocked(urlParserService.parse).mockImplementation(() => {
        throw new Error("Invalid URL format");
      });

      mockPrisma.integration.findUnique.mockResolvedValue({
        id: 5,
        providerId: 1,
        provider: { id: 1, name: "youtube" },
      } as any);

      mockPrisma.task.create.mockResolvedValue({
        id: 4,
        type: TaskType.ANALYZE_POST,
        userId: "user123",
        providerId: 1,
        integrationId: 5,
        status: "PENDING",
      } as any);

      vi.mocked(subtaskService.createSubTask).mockResolvedValue({} as any);

      // Execute
      const result = await taskService.createTask({
        userId: "user123",
        taskType: TaskType.ANALYZE_POST,
        integrationId: 5,
        extraData: {
          url: "malformed-url",
        },
      });

      // Verify
      expect(mockPrisma.integration.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        include: { provider: true },
      });
      expect(result.id).toBe(4);
    });

    it("should throw error when no providerId can be resolved", async () => {
      // Setup mocks - URL parsing fails and no integrationId provided
      vi.mocked(urlParserService.parse).mockImplementation(() => {
        throw new Error("Invalid URL format");
      });

      // Execute & Verify
      await expect(
        taskService.createTask({
          userId: "user123",
          taskType: TaskType.ANALYZE_POST,
          integrationId: null,
          extraData: {
            url: "malformed-url",
          },
        }),
      ).rejects.toThrow("URL parsing failed: Invalid URL format");
    });
  });

  describe("error handling", () => {
    it("should handle provider resolution failure gracefully", async () => {
      vi.mocked(urlParserService.parse).mockReturnValue({
        provider: "unknown" as Provider,
        url: "https://unknown.com/post/123",
        metadata: {},
      });

      vi.mocked(providerService.getProviderByName).mockRejectedValue(
        new Error("Provider not found"),
      );

      await expect(
        taskService.createTask({
          userId: "user123",
          taskType: TaskType.ANALYZE_POST,
          integrationId: null,
          extraData: {
            url: "https://unknown.com/post/123",
            token: "test-token",
          },
        }),
      ).rejects.toThrow("Unsupported provider: unknown");
    });
  });
});
