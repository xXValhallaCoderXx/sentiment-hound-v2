// Types for onboarding system
export interface OnboardingStatus {
  isAuthenticated: boolean;
  hasIntegrations: boolean;
  integrationCount: number;
}

export interface OnboardingProvider {
  name: string;
  icon: React.ComponentType<{ size?: number | string }>;
  color: string;
  description: string;
}

export interface OnboardingModalProps {
  opened: boolean;
  onClose: () => void;
}

export interface OnboardingWrapperProps {
  children: React.ReactNode;
}
