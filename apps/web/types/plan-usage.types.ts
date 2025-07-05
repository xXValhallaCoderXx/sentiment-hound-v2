// Types for plan and usage data
import { ReactNode } from "react";

export interface PlanData {
  /** Plan identifier */
  id: string | number;
  /** Plan name (e.g., "Developer", "Trial", "Starter", "Pro") */
  name: string;
  /** Plan description */
  description: string;
  /** Plan price in cents */
  price: number;
  /** Yearly plan price in cents */
  yearlyPrice?: number;
  /** Billing interval */
  billingInterval: string;
  /** Maximum number of integrations allowed */
  maxIntegrations: number;
  /** Maximum number of tracked keywords allowed */
  maxTrackedKeywords: number;
  /** Maximum number of competitors allowed */
  maxCompetitors: number;
  /** Monthly token allowance */
  monthlyTokenAllowance: number;
  /** Plan features object - can be any JSON value from Prisma */
  features:
    | Record<string, unknown>
    | string
    | number
    | boolean
    | unknown[]
    | null;
  /** Whether the plan is active */
  isActive: boolean;
  /** Display order for sorting */
  displayOrder: number;
}

export interface TokenUsage {
  /** Current token usage in this period */
  current: number;
  /** Token limit for the current plan */
  limit: number;
  /** End date of current billing period */
  periodEnd: Date | null;
  /** Whether user has exceeded token limit */
  isOverage: boolean;
  /** Usage percentage (0-100+) */
  percentage: number;
}

export interface UsageProgress {
  /** Current usage amount */
  current: number;
  /** Maximum allowed amount */
  max: number;
  /** Usage percentage (0-100) */
  percentage: number;
  /** Color variant based on usage level */
  color: "green" | "yellow" | "red" | "blue";
}

export interface PlanUsageStats {
  /** Integration usage statistics */
  integrations: {
    current: number;
    max: number;
  };
  /** Tracked keywords usage statistics */
  trackedKeywords: {
    current: number;
    max: number;
  };
  /** Competitor tracking usage statistics */
  competitors?: {
    current: number;
    max: number;
  };
  /** Token usage statistics */
  tokens: {
    current: number;
    max: number;
    periodEnd: Date | null;
  };
}

export interface TokenUsageProgressProps {
  /** Total tokens allowed */
  totalTokens: number;
  /** Tokens used in current period */
  usedTokens: number;
  /** End date of current billing period */
  periodEnd: Date | null;
  /** Custom color override */
  colorOverride?: "green" | "yellow" | "red" | "blue";
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  hasError?: boolean;
}

export interface PlanBadgeProps {
  /** Plan name to display */
  planName: string;
  /** Badge variant */
  variant?: "filled" | "light" | "outline" | "dot";
  /** Badge size */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Badge color */
  color?: string;
}

export interface UsageNotification {
  /** Whether to show notification */
  shouldNotify: boolean;
  /** Type of notification */
  notificationType: "warning_80" | "warning_100" | "overage" | null;
  /** Current usage percentage */
  percentage: number;
  /** Optional custom message */
  message?: string;
}

export interface PlanFeatureMatrix {
  /** Monthly token allowance */
  monthlyTokenAllowance: number;
  /** Number of data integrations allowed */
  dataIntegrations: number;
  /** Competitor tracking limit (false if not allowed) */
  competitorTracking: number | false;
  /** Whether spam and bot filtering is enabled */
  spamBotFiltering: boolean;
  /** Whether actionable insights are enabled */
  actionableInsights: boolean;
  /** Whether data export is enabled */
  dataExport: boolean;
  /** Whether email/chat support is enabled */
  emailChatSupport: boolean;
}

export interface PlanComparisonItem {
  /** Feature label */
  label: string;
  /** Feature value display */
  value: string | ReactNode;
  /** Whether this feature is enabled for the plan */
  enabled: boolean;
  /** Optional tooltip text */
  tooltip?: string;
}

export interface UserPlanInfo {
  /** User's current plan data */
  plan: PlanData | null;
  /** Token usage information */
  tokenUsage: TokenUsage | null;
  /** Whether user data is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}
