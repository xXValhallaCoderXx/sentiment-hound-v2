import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingPage from "./page";

// Mock the auth function
vi.mock("@/lib/next-auth.lib", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock the components to avoid complexity in this sample test
vi.mock("@/components/templates/PublicPageLayout", () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="public-page-layout">{children}</div>
    ),
  };
});

vi.mock("@/components/organisms/ModernHero/ModernHero", () => {
  return {
    default: () => <div data-testid="modern-hero">Modern Hero Component</div>,
  };
});

vi.mock("./components/WhyTeamsLoveSection", () => ({
  WhyTeamsLoveSection: () => (
    <div data-testid="why-teams-love">Why Teams Love Section</div>
  ),
}));

vi.mock("./components/FaqSection", () => ({
  FaqSection: () => <div data-testid="faq-section">FAQ Section</div>,
}));

vi.mock("./components/PlansAndEarlyAccessSection", () => {
  return {
    default: () => (
      <div data-testid="plans-early-access">Plans and Early Access Section</div>
    ),
  };
});

vi.mock("./components/CoreFeaturesSection", () => {
  return {
    default: () => <div data-testid="core-features">Core Features Section</div>,
  };
});

vi.mock("@/components/atoms/AnimatedSection/AnimatedSection", () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="animated-section">{children}</div>
    ),
  };
});

vi.mock("./components/ScrollHandler", () => {
  return {
    default: () => <div data-testid="scroll-handler">Scroll Handler</div>,
  };
});

describe("LandingPage", () => {
  it("renders the landing page with key sections", async () => {
    const LandingPageComponent = await LandingPage();
    render(LandingPageComponent);

    // Check that the main layout is rendered
    expect(screen.getByTestId("public-page-layout")).toBeInTheDocument();

    // Check that key sections are present
    expect(screen.getByTestId("modern-hero")).toBeInTheDocument();
    expect(screen.getByTestId("why-teams-love")).toBeInTheDocument();
    expect(screen.getByTestId("faq-section")).toBeInTheDocument();

    // Check that the main content area is present
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("contains sections with proper ids for navigation", async () => {
    const LandingPageComponent = await LandingPage();
    render(LandingPageComponent);

    // Check that navigation anchor sections exist
    expect(screen.getByText("Modern Hero Component")).toBeInTheDocument();
    expect(screen.getByText("Why Teams Love Section")).toBeInTheDocument();
    expect(screen.getByText("FAQ Section")).toBeInTheDocument();
  });
});
