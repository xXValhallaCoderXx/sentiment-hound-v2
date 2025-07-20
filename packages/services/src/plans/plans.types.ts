/**
 * Enum for plan names to ensure type safety and prevent typos across the application
 */
export enum PlanName {
  DEVELOPER = "Developer",
  TRIAL = "Trial",
  STARTER = "Starter",
  PRO = "Pro",
}

/**
 * Feature matrix type definition for plan comparison
 */
export interface PlanFeatureMatrix {
  monthlyTokenAllowance: number;
  dataIntegrations: number;
  competitorTracking: number | false;
  spamBotFiltering: boolean;
  actionableInsights: boolean;
  dataExport: boolean;
  emailChatSupport: boolean;
}

/**
 * Plan hierarchy for determining upgrade/downgrade relationships
 */
export const PLAN_HIERARCHY = {
  [PlanName.TRIAL]: 0,
  [PlanName.STARTER]: 1,
  [PlanName.PRO]: 2,
  // Developer plan is not included in public hierarchy
} as const;

/**
 * Feature matrix definition for each plan as specified in the PRD
 */
export const PLAN_FEATURES: Record<
  PlanName.TRIAL | PlanName.STARTER | PlanName.PRO,
  PlanFeatureMatrix
> = {
  [PlanName.TRIAL]: {
    monthlyTokenAllowance: 0,
    dataIntegrations: 0,
    competitorTracking: false,
    spamBotFiltering: false,
    actionableInsights: false,
    dataExport: false,
    emailChatSupport: false,
  },
  [PlanName.STARTER]: {
    monthlyTokenAllowance: 300000,
    dataIntegrations: 3,
    competitorTracking: 1,
    spamBotFiltering: true,
    actionableInsights: false,
    dataExport: false,
    emailChatSupport: true,
  },
  [PlanName.PRO]: {
    monthlyTokenAllowance: 2500000,
    dataIntegrations: 10,
    competitorTracking: 5,
    spamBotFiltering: true,
    actionableInsights: true,
    dataExport: true,
    emailChatSupport: true,
  },
};
