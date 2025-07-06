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

describe("YoutubeContentService - Authentication Method Detection", () => {
  let service: YoutubeContentService;
  let mockAuthService: YoutubeAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService = new YoutubeAuthService();
    service = new YoutubeContentService(mockAuthService);
  });

  describe("detectAuthenticationMethod", () => {
    it("should detect OAuth tokens by length and format", () => {
      // OAuth tokens are typically long and may contain dots/dashes
      const oauthToken = "ya29.a0AfH6SMCxyz123.very-long-oauth-token-with-many-characters-and-dots-typical-of-google-oauth";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(oauthToken);
      expect(result).toBe(AuthenticationMethod.OAUTH);
    });

    it("should detect OAuth tokens with dots", () => {
      const oauthTokenWithDots = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4.example.token";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(oauthTokenWithDots);
      expect(result).toBe(AuthenticationMethod.OAUTH);
    });

    it("should detect OAuth tokens with dashes", () => {
      const oauthTokenWithDashes = "ya29-AbCdEfGhIjKlMnOpQrStUvWxYz";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(oauthTokenWithDashes);
      expect(result).toBe(AuthenticationMethod.OAUTH);
    });

    it("should detect API keys by typical Google format", () => {
      // Google API keys are typically 39 characters, alphanumeric
      const apiKey = "AIzaSyB1234567890123456789012345678901";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(apiKey);
      expect(result).toBe(AuthenticationMethod.API_KEY);
    });

    it("should detect shorter API keys", () => {
      const shortApiKey = "abcd1234efgh5678ijkl";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(shortApiKey);
      expect(result).toBe(AuthenticationMethod.API_KEY);
    });

    it("should default to API key for ambiguous tokens", () => {
      const ambiguousToken = "short";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(ambiguousToken);
      expect(result).toBe(AuthenticationMethod.API_KEY);
    });

    it("should handle edge cases", () => {
      const edgeCaseToken = "exactly50characterslong1234567890123456789012";
      // @ts-ignore - accessing private method for testing
      const result = service.detectAuthenticationMethod(edgeCaseToken);
      expect(result).toBe(AuthenticationMethod.API_KEY);
    });
  });

  describe("buildRequestConfig", () => {
    it("should build OAuth configuration with Authorization header", () => {
      const oauthToken = "ya29.a0AfH6SMCxyz123.very-long-oauth-token-with-many-characters-and-dots-typical-of-google-oauth";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
      
      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(oauthToken, baseUrl);
      
      expect(result.url).toBe(baseUrl);
      expect(result.headers).toEqual({
        Authorization: `Bearer ${oauthToken}`,
      });
    });

    it("should build API key configuration with URL parameter", () => {
      const apiKey = "AIzaSyB1234567890123456789012345678901";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
      
      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(apiKey, baseUrl);
      
      expect(result.url).toBe(`${baseUrl}?key=${encodeURIComponent(apiKey)}`);
      expect(result.headers).toEqual({});
    });

    it("should handle URL with existing query parameters for API key", () => {
      const apiKey = "AIzaSyB1234567890123456789012345678901";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet";
      
      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(apiKey, baseUrl);
      
      expect(result.url).toBe(`${baseUrl}&key=${encodeURIComponent(apiKey)}`);
      expect(result.headers).toEqual({});
    });

    it("should properly encode special characters in API key", () => {
      const apiKeyWithSpecialChars = "APIkey_with+special&chars=test123";
      const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
      
      // @ts-ignore - accessing private method for testing
      const result = service.buildRequestConfig(apiKeyWithSpecialChars, baseUrl);
      
      expect(result.url).toBe(`${baseUrl}?key=${encodeURIComponent(apiKeyWithSpecialChars)}`);
      expect(result.headers).toEqual({});
    });
  });
});

export {};
