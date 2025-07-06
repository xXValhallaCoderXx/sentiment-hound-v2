/**
 * Unit tests for URL validation utilities
 */

import { describe, it, expect } from "vitest";
import {
  validateUrl,
  isValidYouTubeUrl,
  isValidRedditUrl,
  getUrlValidationErrorMessage,
  validateUrlWithDetails,
} from "./url.validation";

describe("URL Validation Utilities", () => {
  describe("validateUrl", () => {
    describe("basic validation", () => {
      it("should reject empty strings", () => {
        const result = validateUrl("");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Please enter a URL");
      });

      it("should reject null/undefined", () => {
        // @ts-expect-error Testing invalid input
        const result1 = validateUrl(null);
        expect(result1.isValid).toBe(false);
        expect(result1.error).toBe("Please enter a URL");

        // @ts-expect-error Testing invalid input
        const result2 = validateUrl(undefined);
        expect(result2.isValid).toBe(false);
        expect(result2.error).toBe("Please enter a URL");
      });

      it("should reject whitespace-only strings", () => {
        const result = validateUrl("   ");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Please enter a URL");
      });

      it("should reject URLs without proper protocol", () => {
        const result = validateUrl("youtube.com/watch?v=dQw4w9WgXcQ");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("URL must start with http:// or https://");
      });
    });

    describe("YouTube URL validation", () => {
      it("should accept valid YouTube URLs", () => {
        const validUrls = [
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "https://youtube.com/watch?v=dQw4w9WgXcQ",
          "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
          "https://youtu.be/dQw4w9WgXcQ",
          "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ];

        validUrls.forEach((url) => {
          const result = validateUrl(url);
          expect(result.isValid).toBe(true);
          expect(result.provider).toBe("youtube");
          expect(result.error).toBeUndefined();
        });
      });

      it("should reject invalid YouTube URLs", () => {
        const invalidUrls = [
          "https://www.youtube.com/watch", // No video ID
          "https://www.youtube.com/watch?v=", // Empty video ID
          "https://www.youtube.com/watch?v=short", // Invalid video ID format
          "https://youtu.be/", // No video ID in short format
        ];

        invalidUrls.forEach((url) => {
          const result = validateUrl(url);
          expect(result.isValid).toBe(false);
          expect(result.error).toBe("This platform is not yet supported. Currently supporting YouTube.");
        });
      });
    });

    describe("unsupported platforms", () => {
      it("should reject unsupported platforms with helpful message", () => {
        const unsupportedUrls = [
          "https://vimeo.com/123456789",
          "https://facebook.com/video/123",
          "https://instagram.com/p/ABC123/",
          "https://tiktok.com/@user/video/123",
        ];

        unsupportedUrls.forEach((url) => {
          const result = validateUrl(url);
          expect(result.isValid).toBe(false);
          expect(result.error).toBe("This platform is not yet supported. Currently supporting YouTube.");
        });
      });
    });

    describe("malformed URLs", () => {
      it("should reject completely malformed URLs", () => {
        // Test URLs without proper protocol
        const result1 = validateUrl("not-a-url");
        expect(result1.isValid).toBe(false);
        expect(result1.error).toBe("URL must start with http:// or https://");

        // Test other malformed URLs
        const malformedUrls = [
          "http://",
          "https://",
          "://missing-protocol.com",
          "htp://wrong-protocol.com",
        ];

        malformedUrls.forEach((url) => {
          const result = validateUrl(url);
          expect(result.isValid).toBe(false);
          // These URLs will either fail the protocol check or URL parsing
          expect(result.error).toMatch(/URL must start with http:\/\/ or https:\/\/|Please enter a valid URL/);
        });
      });
    });
  });

  describe("isValidYouTubeUrl", () => {
    it("should return true for valid YouTube URLs", () => {
      expect(isValidYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
      expect(isValidYouTubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    });

    it("should return false for invalid or non-YouTube URLs", () => {
      expect(isValidYouTubeUrl("https://vimeo.com/123456")).toBe(false);
      expect(isValidYouTubeUrl("not-a-url")).toBe(false);
      expect(isValidYouTubeUrl("")).toBe(false);
    });
  });

  describe("isValidRedditUrl", () => {
    it("should return true for valid Reddit URLs", () => {
      expect(isValidRedditUrl("https://reddit.com/r/programming/comments/123/test/")).toBe(true);
      expect(isValidRedditUrl("https://www.reddit.com/r/programming/comments/abc123/test/")).toBe(true);
    });

    it("should return false for non-Reddit URLs", () => {
      expect(isValidRedditUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
      expect(isValidRedditUrl("https://vimeo.com/123456")).toBe(false);
      expect(isValidRedditUrl("not-a-url")).toBe(false);
    });
  });

  describe("getUrlValidationErrorMessage", () => {
    it("should return appropriate error messages", () => {
      expect(getUrlValidationErrorMessage("")).toBe("Please enter a URL");
      expect(getUrlValidationErrorMessage("not-a-url")).toBe("URL must start with http:// or https://");
      expect(getUrlValidationErrorMessage("https://vimeo.com/123")).toBe("This platform is not yet supported. Currently supporting YouTube.");
    });

    it("should return default message for valid URLs", () => {
      expect(getUrlValidationErrorMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("Invalid URL");
    });
  });

  describe("validateUrlWithDetails", () => {
    it("should provide specific error types for different failures", () => {
      const emptyResult = validateUrlWithDetails("");
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errorType).toBe("empty");

      const malformedResult = validateUrlWithDetails("youtube.com/watch?v=123");
      expect(malformedResult.isValid).toBe(false);
      expect(malformedResult.errorType).toBe("malformed");

      const unsupportedResult = validateUrlWithDetails("https://vimeo.com/123456");
      expect(unsupportedResult.isValid).toBe(false);
      expect(unsupportedResult.errorType).toBe("unsupported");

      const invalidResult = validateUrlWithDetails("not-a-url");
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errorType).toBe("malformed");
    });

    it("should not include errorType for valid URLs", () => {
      const validResult = validateUrlWithDetails("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(validResult.isValid).toBe(true);
      expect(validResult.errorType).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle URLs with tracking parameters", () => {
      const urlWithParams = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=twitter&feature=share";
      const result = validateUrl(urlWithParams);
      expect(result.isValid).toBe(true);
      expect(result.provider).toBe("youtube");
    });

    it("should handle URLs with timestamps", () => {
      const urlWithTimestamp = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s";
      const result = validateUrl(urlWithTimestamp);
      expect(result.isValid).toBe(true);
      expect(result.provider).toBe("youtube");
    });

    it("should handle mobile YouTube URLs", () => {
      const mobileUrl = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
      const result = validateUrl(mobileUrl);
      expect(result.isValid).toBe(true);
      expect(result.provider).toBe("youtube");
    });

    it("should handle embedded YouTube URLs", () => {
      const embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
      const result = validateUrl(embedUrl);
      expect(result.isValid).toBe(true);
      expect(result.provider).toBe("youtube");
    });
  });
});
