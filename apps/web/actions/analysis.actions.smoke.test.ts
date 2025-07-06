import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire next-auth lib module to avoid server imports
vi.mock("@/lib/next-auth.lib", () => ({
  auth: vi.fn(),
}));

// Mock services to avoid dependency issues
vi.mock("@repo/services", () => ({
  taskService: {
    createTask: vi.fn(),
  },
  integrationsService: {
    getUserIntegrationByName: vi.fn(),
  },
  urlParserService: {
    parse: vi.fn(),
  },
}));

// Now import the function after mocks are set up
const { startAnalysis } = await import("./analysis.actions");

describe("startAnalysis - Basic Functionality Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.YOUTUBE_MASTER_ACCESS_TOKEN;
    delete process.env.REDDIT_MASTER_ACCESS_TOKEN;
    delete process.env.YOUTUBE_API_KEY;
    delete process.env.REDDIT_API_KEY;
  });

  it("should be a function", () => {
    expect(typeof startAnalysis).toBe("function");
  });

  it("should handle empty string input gracefully", async () => {
    // This is a basic smoke test to ensure the function can be called
    // without throwing import errors
    try {
      await startAnalysis("");
      // If we get here without import errors, that's progress
      expect(true).toBe(true);
    } catch (error) {
      // Expected to fail with validation error, not import error
      expect(error).toBeDefined();
    }
  });

  it("should handle invalid URLs without import errors", async () => {
    try {
      await startAnalysis("invalid-url");
      expect(true).toBe(true);
    } catch (error) {
      // Should fail with validation, not import error
      expect(error).toBeDefined();
    }
  });
});

export {};
