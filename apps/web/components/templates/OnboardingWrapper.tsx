"use client";

import { useEffect, useState } from "react";
import { OnboardingModal } from "../organisms/OnboardingModal";
import { shouldShowOnboarding } from "@/actions/integrations.actions";

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const shouldShow = await shouldShowOnboarding();
        setShowOnboarding(shouldShow);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <OnboardingModal
        opened={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </>
  );
}