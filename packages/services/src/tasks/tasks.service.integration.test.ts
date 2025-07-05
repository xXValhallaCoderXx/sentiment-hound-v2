import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { TaskType, TaskStatus } from "@repo/db";
import { Provider } from "../url-parser/url-parser.types";
import type { PrismaClient } from "@repo/db";

// Mock the services exports - must be at top level to avoid hoisting issues
vi.mock("../index", () => ({
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
  urlParserService,
  integrationsService,
  subtaskService,
} from "../index";

describe("CoreTaskService Integration Tests", () => {
  let service: CoreTaskService;
  let mockPrisma: any;

  // Get the mocked services for use in tests
  const mockUrlParserService = vi.mocked(urlParserService);
  const mockIntegrationsService = vi.mocked(integrationsService);
  const mockSubtaskService = vi.mocked(subtaskService);

  beforeEach(() => {
    // Create a mock Prisma client
    mockPrisma = {
      task: {
        create: vi.fn(),
        update: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
      integration: {
        findUnique: vi.fn(),
      },
    } as unknown as PrismaClient;

    // Initialize the service with mocked Prisma
    service = new CoreTaskService(mockPrisma);

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("URL-driven Task Creation Integration", () => {
    // Shared mock data
    const mockCompleteIntegration = {
      id: 100,
      userId: "user123",
      accountId: "account123",
      accessToken: "token123",
      refreshToken: "refresh123",
      refreshTokenExpiresAt: new Date("2024-12-31"),
      isActive: true,
      providerId: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      provider: {
        id: 1,
        name: "youtube",
        image: "youtube.png",
      },
    };

    describe("valid YouTube URLs", () => {
      it("should create task with valid YouTube URL and find integration by provider", async () => {
        const mockTask = { id: 1, status: TaskStatus.PENDING };
        const mockParseResult = {
          provider: Provider.YOUTUBE,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          metadata: { videoId: "dQw4w9WgXcQ", timestamp: "30s" },
        };

        mockUrlParserService.parse.mockReturnValue(mockParseResult);
        mockPrisma.task.create.mockResolvedValue(mockTask);
        mockIntegrationsService.getUserIntegrationByName.mockResolvedValue(
          mockCompleteIntegration
        );

        const result = await service.createTask({
          userId: "user123",
          integrationId: 99, // Different from found integration
          taskType: TaskType.ANALYZE_POST,
          extraData: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
          },
        });

        expect(mockUrlParserService.parse).toHaveBeenCalledWith(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s"
        );
        expect(
          mockIntegrationsService.getUserIntegrationByName
        ).toHaveBeenCalledWith("user123", Provider.YOUTUBE);
        expect(result).toEqual(mockTask);
      });

      it("should handle YouTube URL with no integration found", async () => {
        const mockTask = { id: 1, status: TaskStatus.PENDING };
        const mockParseResult = {
          provider: Provider.YOUTUBE,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          metadata: { videoId: "dQw4w9WgXcQ" },
        };

        mockUrlParserService.parse.mockReturnValue(mockParseResult);
        mockPrisma.task.create.mockResolvedValue(mockTask);
        mockIntegrationsService.getUserIntegrationByName.mockResolvedValue(
          null
        ); // No integration found

        await expect(
          service.createTask({
            userId: "user123",
            integrationId: 99, // Fallback to provided integration
            taskType: TaskType.ANALYZE_POST,
            extraData: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          })
        ).rejects.toThrow(
          "No integration found for youtube. Please connect your youtube account first."
        );

        expect(mockUrlParserService.parse).toHaveBeenCalled();
        expect(
          mockIntegrationsService.getUserIntegrationByName
        ).toHaveBeenCalledWith("user123", Provider.YOUTUBE);
      });
    });

    describe("error handling", () => {
      it("should handle URL parsing errors and fall back to integration lookup", async () => {
        const mockTask = { id: 1, status: TaskStatus.PENDING };
        const mockIntegration = mockCompleteIntegration;

        // Mock the fallback integration lookup to succeed
        mockPrisma.task.create.mockResolvedValue(mockTask);
        mockPrisma.integration.findUnique.mockResolvedValue(mockIntegration);

        mockUrlParserService.parse.mockImplementation(() => {
          throw new Error("Invalid URL format");
        });

        const result = await service.createTask({
          userId: "user123",
          integrationId: 99,
          taskType: TaskType.ANALYZE_POST,
          extraData: { url: "invalid-url" },
        });

        expect(mockUrlParserService.parse).toHaveBeenCalledWith("invalid-url");
        expect(mockPrisma.task.create).toHaveBeenCalled();
        expect(result).toEqual(mockTask);
      });

      it("should handle integration service errors gracefully", async () => {
        const mockParseResult = {
          provider: Provider.YOUTUBE,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          metadata: { videoId: "dQw4w9WgXcQ" },
        };

        mockUrlParserService.parse.mockReturnValue(mockParseResult);
        mockPrisma.task.create.mockResolvedValue({
          id: 1,
          status: TaskStatus.PENDING,
        });
        mockIntegrationsService.getUserIntegrationByName.mockRejectedValue(
          new Error("Database connection failed")
        );

        await expect(
          service.createTask({
            userId: "user123",
            integrationId: 99,
            taskType: TaskType.ANALYZE_POST,
            extraData: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          })
        ).rejects.toThrow("Database connection failed");

        expect(mockUrlParserService.parse).toHaveBeenCalled();
        expect(
          mockIntegrationsService.getUserIntegrationByName
        ).toHaveBeenCalled();
      });
    });

    describe("task creation without URLs", () => {
      it("should handle tasks without URL in extraData normally", async () => {
        const mockTask = { id: 1, status: TaskStatus.PENDING };
        const mockIntegration = mockCompleteIntegration;

        mockPrisma.task.create.mockResolvedValue(mockTask);
        mockPrisma.integration.findUnique.mockResolvedValue(mockIntegration);

        const result = await service.createTask({
          userId: "user123",
          integrationId: 99,
          taskType: TaskType.ANALYZE_POST,
          extraData: {
            someOtherField: "value",
          },
        });

        // URL parser should not be called when no URL is present
        expect(mockUrlParserService.parse).not.toHaveBeenCalled();
        expect(
          mockIntegrationsService.getUserIntegrationByName
        ).not.toHaveBeenCalled();
        expect(mockPrisma.integration.findUnique).toHaveBeenCalledWith({
          where: { id: 99 },
          include: { provider: true },
        });
        expect(result).toEqual(mockTask);
      });

      it("should handle tasks with empty extraData", async () => {
        const mockTask = { id: 1, status: TaskStatus.PENDING };
        const mockIntegration = mockCompleteIntegration;

        mockPrisma.task.create.mockResolvedValue(mockTask);
        mockPrisma.integration.findUnique.mockResolvedValue(mockIntegration);

        const result = await service.createTask({
          userId: "user123",
          integrationId: 99,
          taskType: TaskType.ANALYZE_POST,
          extraData: {},
        });

        expect(mockUrlParserService.parse).not.toHaveBeenCalled();
        expect(
          mockIntegrationsService.getUserIntegrationByName
        ).not.toHaveBeenCalled();
        expect(result).toEqual(mockTask);
      });
    });
  });

  describe("Regular Task Operations", () => {
    it("should handle basic task creation without URL processing", async () => {
      const mockTask = { id: 1, status: TaskStatus.PENDING };
      const mockIntegration = {
        id: 99,
        userId: "user123",
        accountId: "account123",
        accessToken: "token123",
        refreshToken: "refresh123",
        refreshTokenExpiresAt: new Date("2024-12-31"),
        isActive: true,
        providerId: 1,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        provider: {
          id: 1,
          name: "youtube",
          image: "youtube.png",
        },
      };

      mockPrisma.task.create.mockResolvedValue(mockTask);
      mockPrisma.integration.findUnique.mockResolvedValue(mockIntegration);

      const result = await service.createTask({
        userId: "user123",
        integrationId: 99,
        taskType: TaskType.ANALYZE_POST,
        extraData: { regularField: "value" },
      });

      expect(mockUrlParserService.parse).not.toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });
});
