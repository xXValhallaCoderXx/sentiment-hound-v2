import { describe, it, expect, beforeEach, vi } from "vitest";
import { CorePostService } from "./posts.service";
import { ICreatePost } from "./post.interface";

// Mock dependencies
const mockRepository = {
  create: vi.fn(),
  findMany: vi.fn(),
  findById: vi.fn(),
  createMany: vi.fn(),
  count: vi.fn(),
};

describe("CorePostService", () => {
  let postService: CorePostService;

  beforeEach(() => {
    vi.clearAllMocks();
    postService = new CorePostService(mockRepository as any);
  });

  describe("createUserPost", () => {
    it("should create post with providerId and integrationId", async () => {
      const createPostData: ICreatePost = {
        id: 1,
        userId: "user123",
        title: "Test Post",
        content: "Test content",
        providerId: 1,
        integrationId: 5,
        commentCount: 10,
        description: "Test description",
        publishedAt: new Date("2024-01-01"),
        imageUrl: "https://example.com/image.jpg",
        postUrl: "https://youtube.com/watch?v=test123",
        remoteId: "test123",
      };

      const expectedPost = {
        id: 1,
        userId: "user123",
        title: "Test Post",
        providerId: 1,
        integrationId: 5,
        commentCount: 10,
        description: "Test description",
        publishedAt: new Date("2024-01-01"),
        imageUrl: "https://example.com/image.jpg",
        postUrl: "https://youtube.com/watch?v=test123",
        remoteId: "test123",
      };

      mockRepository.create.mockResolvedValue(expectedPost);

      const result = await postService.createUserPost(createPostData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        data: {
          userId: "user123",
          title: "Test Post",
          providerId: 1,
          integrationId: 5,
          commentCount: 10,
          description: "Test description",
          publishedAt: new Date("2024-01-01"),
          imageUrl: "https://example.com/image.jpg",
          postUrl: "https://youtube.com/watch?v=test123",
          remoteId: "test123",
        },
      });

      expect(result).toEqual(expectedPost);
    });

    it("should create post with providerId but without integrationId for API key auth", async () => {
      const createPostData: ICreatePost = {
        id: 2,
        userId: "user456",
        title: "API Key Post",
        content: "Content via API key",
        providerId: 2,
        // integrationId is omitted for API key authentication
        commentCount: 5,
        description: "API key post description",
        publishedAt: new Date("2024-01-02"),
        imageUrl: "https://example.com/image2.jpg",
        postUrl: "https://reddit.com/r/test/comments/abc123",
        remoteId: "abc123",
      };

      const expectedPost = {
        id: 2,
        userId: "user456",
        title: "API Key Post",
        providerId: 2,
        commentCount: 5,
        description: "API key post description",
        publishedAt: new Date("2024-01-02"),
        imageUrl: "https://example.com/image2.jpg",
        postUrl: "https://reddit.com/r/test/comments/abc123",
        remoteId: "abc123",
      };

      mockRepository.create.mockResolvedValue(expectedPost);

      const result = await postService.createUserPost(createPostData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        data: {
          userId: "user456",
          title: "API Key Post",
          providerId: 2,
          commentCount: 5,
          description: "API key post description",
          publishedAt: new Date("2024-01-02"),
          imageUrl: "https://example.com/image2.jpg",
          postUrl: "https://reddit.com/r/test/comments/abc123",
          remoteId: "abc123",
        },
      });

      expect(result).toEqual(expectedPost);
    });

    it("should handle default values when optional fields are missing", async () => {
      const createPostData: ICreatePost = {
        id: 3,
        userId: "user789",
        title: "Minimal Post",
        content: "",
        providerId: 1,
        integrationId: 3,
        commentCount: 0,
        description: "",
        publishedAt: new Date(),
        imageUrl: "",
        postUrl: "",
        remoteId: "",
      };

      const expectedPost = {
        id: 3,
        userId: "user789",
        title: "Minimal Post",
        providerId: 1,
        integrationId: 3,
      };

      mockRepository.create.mockResolvedValue(expectedPost);

      const result = await postService.createUserPost(createPostData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user789",
          title: "Minimal Post",
          providerId: 1,
          integrationId: 3,
          commentCount: 0,
          description: "",
          imageUrl: "",
          postUrl: "",
          remoteId: "",
        }),
      });

      expect(result).toEqual(expectedPost);
    });
  });

  describe("getUserPostsByProvider", () => {
    it("should filter posts by providerId directly", async () => {
      const userId = "user123";
      const providerId = 1;
      const expectedPosts = [
        {
          id: 1,
          userId: "user123",
          providerId: 1,
          title: "YouTube Post 1",
          mentions: [],
        },
        {
          id: 2,
          userId: "user123",
          providerId: 1,
          title: "YouTube Post 2",
          mentions: [],
        },
      ];

      mockRepository.findMany.mockResolvedValue(expectedPosts);

      const result = await postService.getUserPostsByProvider(
        userId,
        providerId,
      );

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user123",
          providerId: 1,
        },
        include: {
          mentions: true,
        },
      });

      expect(result).toEqual(expectedPosts);
    });
  });

  describe("getUserProcessedPosts", () => {
    it("should filter posts by providerId in the new schema", async () => {
      const filterParams = {
        userId: "user123",
        providerId: 1,
        page: 1,
        pageSize: 10,
      };

      const mockPosts = [
        {
          id: 1,
          userId: "user123",
          providerId: 1,
          title: "Test Post",
          createdAt: new Date(),
        },
      ];

      mockRepository.findMany.mockResolvedValue(mockPosts);
      mockRepository.count.mockResolvedValue(1);

      const result = await postService.getUserProcessedPosts(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: "user123",
          providerId: 1,
        }),
        include: expect.objectContaining({
          provider: true,
          integration: expect.objectContaining({
            include: { provider: true },
          }),
        }),
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      expect(result.data).toEqual(mockPosts);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it("should filter posts by integrationId when specified", async () => {
      const filterParams = {
        userId: "user123",
        integrationId: 5,
        page: 1,
        pageSize: 10,
      };

      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      await postService.getUserProcessedPosts(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: "user123",
          integrationId: 5,
        }),
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    });

    it("should support filtering by both providerId and integrationId", async () => {
      const filterParams = {
        userId: "user123",
        providerId: 1,
        integrationId: 5,
        page: 1,
        pageSize: 10,
      };

      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      await postService.getUserProcessedPosts(filterParams);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: "user123",
          providerId: 1,
          integrationId: 5,
        }),
        include: expect.any(Object),
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("backward compatibility", () => {
    it("should continue to work with existing post queries", async () => {
      const userId = "user123";

      mockRepository.findMany.mockResolvedValue([]);

      await postService.findByUserId(userId);

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
