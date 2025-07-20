import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticationMethod } from "../youtube.types";
import { YoutubeContentService } from "./content.service";
import { YoutubeAuthService } from "./auth.service";

// Mock dependencies to avoid integration issues
vi.mock("../../..", () => ({
  integrationsService: {
    getUserIntegrationByName: vi.fn(),
    updateIntegrationAuthCredentials: vi.fn(),
  },
}));

vi.mock("../youtube.services", () => ({
  YoutubeService: vi.fn().mockImplementation(() => ({
    refreshAccessToken: vi.fn(),
  })),
  youtubeService: {
    refreshAccessToken: vi.fn(),
  },
}));

vi.mock("./auth.service", () => ({
  YoutubeAuthService: vi.fn().mockImplementation(() => ({})),
}));

describe("YoutubeContentService - Explicit Authentication Method", () => {
  let service: YoutubeContentService;
  let mockAuthService: YoutubeAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService = new YoutubeAuthService();
    service = new YoutubeContentService(mockAuthService);
  });

  describe("buildRequestConfig (internal method)", () => {
    it("should build OAuth configuration with Authorization header", () => {
      const oauthToken =
        "ya29.AHES6ZT_Long_OAuth_Token_Format_With_Dots.And.Dashes-12345";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";

      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(oauthToken, "OAUTH", baseUrl);

      expect(result.url).toBe(baseUrl);
      expect(result.headers?.Authorization).toBe(`Bearer ${oauthToken}`);
    });

    it("should build API key configuration with URL parameter", () => {
      const apiKey = "AIzaSyB1234567890123456789012345678901";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";

      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(apiKey, "API_KEY", baseUrl);

      expect(result.url).toBe(`${baseUrl}?key=${apiKey}`);
      expect(result.headers).toBeDefined();
    });

    it("should handle URL with existing query parameters for API key", () => {
      const apiKey = "AIzaSyB1234567890123456789012345678901";
      const baseUrl =
        "https://www.googleapis.com/youtube/v3/videos?part=snippet";

      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(apiKey, "API_KEY", baseUrl);

      expect(result.url).toBe(`${baseUrl}&key=${apiKey}`);
      expect(result.headers).toBeDefined();
    });

    it("should properly encode special characters in API key", () => {
      const specialApiKey = "AIzaSyB_special+chars&more=stuff";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";

      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(
        specialApiKey,
        "API_KEY",
        baseUrl,
      );

      expect(result.url).toBe(
        `${baseUrl}?key=${encodeURIComponent(specialApiKey)}`,
      );
      expect(result.headers).toBeDefined();
    });
  });

  describe("fetchSingleYoutubeVideo", () => {
    it("should require explicit authMethod parameter", () => {
      // The method should accept exactly 3 parameters: token, authMethod, videoUrl
      expect(service.fetchSingleYoutubeVideo.length).toBe(3);
    });

    it("should call method without errors with valid parameters", async () => {
      const oauthToken = "ya29.oauth-token-example";
      const videoUrl = "https://youtube.com/watch?v=test123";

      // This will return null due to auth issues but should not crash
      const result = await service.fetchSingleYoutubeVideo(
        oauthToken,
        "OAUTH",
        videoUrl,
      );
      expect(result).toBeNull();
    });

    it("should handle API key authentication method", async () => {
      const apiKey = "AIzaSyC1234567890123456789012345678901";
      const videoUrl = "https://youtube.com/watch?v=test123";

      // This will return null due to auth issues but should not crash
      const result = await service.fetchSingleYoutubeVideo(
        apiKey,
        "API_KEY",
        videoUrl,
      );
      expect(result).toBeNull();
    });
  });
});
