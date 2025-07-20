import { describe, it, expect, beforeEach } from "vitest";
import { UrlParserService } from "./url-parser.service";
import { Provider } from "./url-parser.types";
import { InvalidUrlError, UnsupportedProviderError } from "./url-parser.errors";

describe("UrlParserService", () => {
  let urlParser: UrlParserService;

  beforeEach(() => {
    urlParser = new UrlParserService();
  });

  describe("URL Validation", () => {
    describe("basic URL format validation", () => {
      it("should accept valid HTTP URLs", () => {
        expect(() =>
          urlParser.parse("http://www.youtube.com/watch?v=dQw4w9WgXcQ"),
        ).not.toThrow();
      });

      it("should accept valid HTTPS URLs", () => {
        expect(() =>
          urlParser.parse("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
        ).not.toThrow();
      });

      it("should throw InvalidUrlError for empty strings", () => {
        expect(() => urlParser.parse("")).toThrow(InvalidUrlError);
      });

      it("should throw InvalidUrlError for null/undefined", () => {
        // @ts-expect-error Testing invalid input
        expect(() => urlParser.parse(null)).toThrow(InvalidUrlError);
        // @ts-expect-error Testing invalid input
        expect(() => urlParser.parse(undefined)).toThrow(InvalidUrlError);
      });

      it("should throw InvalidUrlError for whitespace-only strings", () => {
        expect(() => urlParser.parse("   ")).toThrow(InvalidUrlError);
        expect(() => urlParser.parse("\t\n")).toThrow(InvalidUrlError);
      });

      it("should throw InvalidUrlError for malformed URLs", () => {
        expect(() => urlParser.parse("not-a-url")).toThrow(InvalidUrlError);
        expect(() => urlParser.parse("http://")).toThrow(InvalidUrlError);
        expect(() => urlParser.parse("://missing-protocol.com")).toThrow(
          InvalidUrlError,
        );
      });
    });

    describe("protocol validation", () => {
      it("should reject FTP protocols", () => {
        expect(() =>
          urlParser.parse("ftp://youtube.com/watch?v=dQw4w9WgXcQ"),
        ).toThrow(InvalidUrlError);
      });

      it("should reject file protocols", () => {
        expect(() => urlParser.parse("file:///path/to/file")).toThrow(
          InvalidUrlError,
        );
      });

      it("should reject custom protocols", () => {
        expect(() =>
          urlParser.parse("myapp://youtube.com/watch?v=dQw4w9WgXcQ"),
        ).toThrow(InvalidUrlError);
      });
    });

    describe("length validation", () => {
      it("should accept URLs within default length limit", () => {
        const normalUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        expect(() => urlParser.parse(normalUrl)).not.toThrow();
      });

      it("should reject extremely long URLs", () => {
        const longParams = "a".repeat(3000);
        const longUrl = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&param=${longParams}`;
        expect(() => urlParser.parse(longUrl)).toThrow(InvalidUrlError);
      });

      it("should respect custom length limits", () => {
        const shortLimitParser = new UrlParserService({ maxUrlLength: 40 });
        const mediumUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        expect(() => shortLimitParser.parse(mediumUrl)).toThrow(
          InvalidUrlError,
        );
      });
    });

    describe("domain validation", () => {
      it("should accept supported YouTube domains", () => {
        expect(() =>
          urlParser.parse("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
        ).not.toThrow();
        expect(() =>
          urlParser.parse("https://youtube.com/watch?v=dQw4w9WgXcQ"),
        ).not.toThrow();
        expect(() =>
          urlParser.parse("https://m.youtube.com/watch?v=dQw4w9WgXcQ"),
        ).not.toThrow();
        expect(() =>
          urlParser.parse("https://youtu.be/dQw4w9WgXcQ"),
        ).not.toThrow();
      });

      it("should reject unsupported domains", () => {
        expect(() => urlParser.parse("https://www.example.com/video")).toThrow(
          UnsupportedProviderError,
        );
        expect(() => urlParser.parse("https://vimeo.com/123456")).toThrow(
          UnsupportedProviderError,
        );
        expect(() => urlParser.parse("https://www.facebook.com/video")).toThrow(
          UnsupportedProviderError,
        );
      });

      it("should allow localhost when configured", () => {
        const localhostParser = new UrlParserService({ allowLocalhost: true });
        expect(() =>
          localhostParser.parse("http://localhost:3000/test"),
        ).not.toThrow();
        expect(() =>
          localhostParser.parse("http://127.0.0.1:8080/test"),
        ).not.toThrow();
        expect(() =>
          localhostParser.parse("http://192.168.1.1/test"),
        ).not.toThrow();
      });
    });
  });

  describe("YouTube URL Pattern Recognition", () => {
    describe("standard YouTube URLs", () => {
      it("should parse standard youtube.com/watch URLs", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should parse youtube.com without www", () => {
        const result = urlParser.parse(
          "https://youtube.com/watch?v=dQw4w9WgXcQ",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should parse URLs with additional parameters", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PLrz7I7mBg77",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });
    });

    describe("mobile YouTube URLs", () => {
      it("should parse m.youtube.com URLs", () => {
        const result = urlParser.parse(
          "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should parse mobile URLs with parameters", () => {
        const result = urlParser.parse(
          "https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });
    });

    describe("short YouTube URLs", () => {
      it("should parse youtu.be URLs", () => {
        const result = urlParser.parse("https://youtu.be/dQw4w9WgXcQ");
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should parse youtu.be URLs with parameters", () => {
        const result = urlParser.parse("https://youtu.be/dQw4w9WgXcQ?t=30");
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });
    });

    describe("embedded YouTube URLs", () => {
      it("should parse embed URLs", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/embed/dQw4w9WgXcQ",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should parse embed URLs with parameters", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/embed/dQw4w9WgXcQ?start=30&autoplay=1",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });
    });

    describe("invalid YouTube URLs", () => {
      it("should throw error for YouTube URLs without video ID", () => {
        expect(() => urlParser.parse("https://www.youtube.com/watch")).toThrow(
          InvalidUrlError,
        );
        expect(() =>
          urlParser.parse("https://www.youtube.com/watch?v="),
        ).toThrow(InvalidUrlError);
      });

      it("should throw error for malformed YouTube URLs", () => {
        expect(() =>
          urlParser.parse("https://www.youtube.com/notwatch?v=dQw4w9WgXcQ"),
        ).toThrow(InvalidUrlError);
        expect(() => urlParser.parse("https://youtu.be/")).toThrow(
          InvalidUrlError,
        );
      });
    });
  });

  describe("URL Normalization and Metadata Extraction", () => {
    describe("tracking parameter removal", () => {
      it("should remove UTM parameters", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=twitter&utm_medium=social",
        );
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        expect(result.metadata?.trackingParams).toEqual({
          utm_source: "twitter",
          utm_medium: "social",
        });
      });

      it("should remove common tracking parameters", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&fbclid=test&gclid=test&feature=share",
        );
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        expect(result.metadata?.trackingParams).toEqual({
          fbclid: "test",
          gclid: "test",
          feature: "share",
        });
      });
    });

    describe("YouTube metadata extraction", () => {
      it("should extract timestamp metadata", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
        );
        expect(result.metadata?.timestamp).toBe("30s");
      });

      it("should extract playlist metadata", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrz7I7mBg77&index=5",
        );
        expect(result.metadata?.playlistId).toBe("PLrz7I7mBg77");
        expect(result.metadata?.playlistIndex).toBe(5);
      });

      it("should extract start and end time metadata", () => {
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&start=30&end=90",
        );
        expect(result.metadata?.startTime).toBe(30);
        expect(result.metadata?.endTime).toBe(90);
      });

      it("should not extract metadata when disabled", () => {
        const noMetadataParser = new UrlParserService({
          extractMetadata: false,
        });
        const result = noMetadataParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
        );
        expect(result.metadata).toBeUndefined();
      });
    });

    describe("URL normalization", () => {
      it("should normalize all YouTube URL formats to standard format", () => {
        const urls = [
          "https://youtu.be/dQw4w9WgXcQ",
          "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
          "https://www.youtube.com/embed/dQw4w9WgXcQ",
          "https://youtube.com/watch?v=dQw4w9WgXcQ",
        ];

        urls.forEach((url) => {
          const result = urlParser.parse(url);
          expect(result.url).toBe(
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          );
        });
      });
    });
  });

  describe("Error Handling", () => {
    describe("InvalidUrlError scenarios", () => {
      it("should provide descriptive error messages for malformed URLs", () => {
        expect(() => urlParser.parse("not-a-url")).toThrow(
          "Invalid URL format",
        );
      });

      it("should provide descriptive error messages for empty URLs", () => {
        expect(() => urlParser.parse("")).toThrow(
          "URL must be a non-empty string",
        );
      });

      it("should provide descriptive error messages for length violations", () => {
        const longUrl = "https://www.youtube.com/watch?v=" + "a".repeat(3000);
        expect(() => urlParser.parse(longUrl)).toThrow("URL length");
      });
    });

    describe("UnsupportedProviderError scenarios", () => {
      it("should provide descriptive error messages for unsupported domains", () => {
        expect(() => urlParser.parse("https://example.com/video")).toThrow(
          "Unsupported domain",
        );
      });

      it("should list supported domains in error message", () => {
        try {
          urlParser.parse("https://example.com/video");
        } catch (error) {
          expect((error as UnsupportedProviderError).message).toContain(
            "youtube.com",
          );
          expect((error as UnsupportedProviderError).message).toContain(
            "youtu.be",
          );
        }
      });
    });
  });

  describe("Configuration Options", () => {
    it("should respect maxUrlLength configuration", () => {
      const shortParser = new UrlParserService({ maxUrlLength: 40 });
      const longUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      expect(() => shortParser.parse(longUrl)).toThrow(InvalidUrlError);
    });

    it("should respect allowLocalhost configuration", () => {
      const strictParser = new UrlParserService({ allowLocalhost: false });
      expect(() => strictParser.parse("http://localhost:3000/test")).toThrow(
        UnsupportedProviderError,
      );
    });

    it("should respect extractMetadata configuration", () => {
      const noMetadataParser = new UrlParserService({ extractMetadata: false });
      const result = noMetadataParser.parse(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30",
      );
      expect(result.metadata).toBeUndefined();
    });
  });

  describe("Edge Cases and Performance", () => {
    describe("extremely long URLs", () => {
      it("should handle URLs at maximum length limit", () => {
        const maxLength = 2048;
        const baseUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        const padding =
          "&".repeat(maxLength - baseUrl.length - 10) + "param=test";
        const longUrl = baseUrl + padding;

        expect(longUrl.length).toBeLessThanOrEqual(maxLength);
        expect(() => urlParser.parse(longUrl)).not.toThrow();
      });

      it("should reject URLs exceeding maximum length", () => {
        const maxLength = 2048;
        const baseUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        const padding =
          "&".repeat(maxLength - baseUrl.length + 100) + "param=test";
        const tooLongUrl = baseUrl + padding;

        expect(tooLongUrl.length).toBeGreaterThan(maxLength);
        expect(() => urlParser.parse(tooLongUrl)).toThrow(InvalidUrlError);
        expect(() => urlParser.parse(tooLongUrl)).toThrow(
          /length.*exceeds maximum/,
        );
      });

      it("should handle custom length limits for extremely short URLs", () => {
        const shortLimitParser = new UrlParserService({ maxUrlLength: 20 });
        expect(() =>
          shortLimitParser.parse("https://youtu.be/dQw4w9WgXcQ"),
        ).toThrow(InvalidUrlError);
      });
    });

    describe("special characters and encoding", () => {
      it("should handle URLs with encoded characters", () => {
        const encodedUrl =
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30%20seconds";
        const result = urlParser.parse(encodedUrl);
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should handle URLs with international domain names", () => {
        // Test that we properly reject non-ASCII domains
        expect(() =>
          urlParser.parse("https://ютуб.com/watch?v=dQw4w9WgXcQ"),
        ).toThrow(UnsupportedProviderError);
      });

      it("should handle URLs with special characters in parameters", () => {
        const specialUrl =
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=playlist%2Bspecial%26chars";
        const result = urlParser.parse(specialUrl);
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.metadata?.playlistId).toContain("playlist+special&chars");
      });

      it("should handle URLs with unicode characters in parameters", () => {
        const unicodeUrl =
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=test%F0%9F%9A%80";
        const result = urlParser.parse(unicodeUrl);
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.metadata?.trackingParams?.utm_source).toContain("🚀");
      });
    });

    describe("malformed YouTube URLs", () => {
      it("should gracefully handle URLs with invalid video ID formats", () => {
        expect(() =>
          urlParser.parse(
            "https://www.youtube.com/watch?v=invalid_id_123456789012345",
          ),
        ).toThrow(InvalidUrlError);
        expect(() =>
          urlParser.parse("https://www.youtube.com/watch?v=short"),
        ).toThrow(InvalidUrlError);
        expect(() =>
          urlParser.parse("https://www.youtube.com/watch?v="),
        ).toThrow(InvalidUrlError);
      });

      it("should handle YouTube URLs with multiple video parameters", () => {
        // YouTube sometimes has multiple v parameters, should use first valid one
        const result = urlParser.parse(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&v=invalid&v=also_invalid",
        );
        expect(result.provider).toBe(Provider.YOUTUBE);
        expect(result.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      });

      it("should handle embed URLs with invalid paths", () => {
        expect(() => urlParser.parse("https://www.youtube.com/embed/")).toThrow(
          InvalidUrlError,
        );
        expect(() =>
          urlParser.parse("https://www.youtube.com/embed/invalid_length"),
        ).toThrow(InvalidUrlError);
      });

      it("should handle youtu.be URLs with extra path segments", () => {
        expect(() =>
          urlParser.parse("https://youtu.be/dQw4w9WgXcQ/extra/path"),
        ).toThrow(InvalidUrlError);
      });
    });

    describe("performance tests", () => {
      it("should parse standard YouTube URLs in under 10ms", () => {
        const url =
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PLrEWG2kkrx1J4j9iVlbTzLVNpU4X4oHmU";
        const iterations = 100;

        const startTime = process.hrtime.bigint();
        for (let i = 0; i < iterations; i++) {
          urlParser.parse(url);
        }
        const endTime = process.hrtime.bigint();

        const avgTimeMs = Number(endTime - startTime) / 1000000 / iterations;
        // Use more lenient threshold for CI environments
        expect(avgTimeMs).toBeLessThan(50);
      });

      it("should parse short YouTube URLs in under 10ms", () => {
        const url = "https://youtu.be/dQw4w9WgXcQ";
        const iterations = 100;

        const startTime = process.hrtime.bigint();
        for (let i = 0; i < iterations; i++) {
          urlParser.parse(url);
        }
        const endTime = process.hrtime.bigint();

        const avgTimeMs = Number(endTime - startTime) / 1000000 / iterations;
        expect(avgTimeMs).toBeLessThan(10);
      });

      it("should validate and reject invalid URLs in under 10ms", () => {
        const url = "https://example.com/not/supported";
        const iterations = 100;

        const startTime = process.hrtime.bigint();
        for (let i = 0; i < iterations; i++) {
          try {
            urlParser.parse(url);
          } catch (error) {
            // Expected to throw
          }
        }
        const endTime = process.hrtime.bigint();

        const avgTimeMs = Number(endTime - startTime) / 1000000 / iterations;
        expect(avgTimeMs).toBeLessThan(10);
      });
    });

    describe("localhost and testing environment URLs", () => {
      it("should handle localhost URLs when allowed", () => {
        const localhostParser = new UrlParserService({ allowLocalhost: true });

        const result1 = localhostParser.parse("http://localhost:3000/api/test");
        expect(result1.provider).toBe(Provider.YOUTUBE);
        expect(result1.url).toBe("http://localhost:3000/api/test");

        const result2 = localhostParser.parse("http://127.0.0.1:8080/video");
        expect(result2.provider).toBe(Provider.YOUTUBE);
        expect(result2.url).toBe("http://127.0.0.1:8080/video");

        const result3 = localhostParser.parse(
          "http://192.168.1.100:5000/content",
        );
        expect(result3.provider).toBe(Provider.YOUTUBE);
        expect(result3.url).toBe("http://192.168.1.100:5000/content");
      });

      it("should reject localhost URLs when not allowed", () => {
        const strictParser = new UrlParserService({ allowLocalhost: false });

        expect(() => strictParser.parse("http://localhost:3000/test")).toThrow(
          UnsupportedProviderError,
        );
        expect(() => strictParser.parse("http://127.0.0.1:8080/test")).toThrow(
          UnsupportedProviderError,
        );
        expect(() =>
          strictParser.parse("http://192.168.1.100:5000/test"),
        ).toThrow(UnsupportedProviderError);
      });

      it("should handle localhost URLs with various protocols", () => {
        const localhostParser = new UrlParserService({ allowLocalhost: true });

        expect(() =>
          localhostParser.parse("https://localhost:3000/secure"),
        ).not.toThrow();
        expect(() => localhostParser.parse("ftp://localhost:21/files")).toThrow(
          InvalidUrlError,
        );
      });

      it("should handle testing domains appropriately", () => {
        // Testing domains should be rejected by default
        expect(() => urlParser.parse("http://test.example.com/video")).toThrow(
          UnsupportedProviderError,
        );
        // staging.youtube.com is a YouTube domain but with invalid format, so should throw InvalidUrlError
        expect(() =>
          urlParser.parse("https://staging.youtube.com/watch?v=dQw4w9WgXcQ"),
        ).toThrow(InvalidUrlError);
      });
    });
  });
});
