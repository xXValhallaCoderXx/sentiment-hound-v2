import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js modules that cause issues in test environment
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: vi.fn(() => ({
    json: vi.fn(),
    status: vi.fn(),
  })),
}));

// Mock next-auth completely to avoid server module imports
vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/providers/google", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: vi.fn(),
}));

vi.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: vi.fn(),
}));
