"use client";

import { useEffect, useState } from "react";
import { OnboardingModal } from "../organisms/OnboardingModal";
import { shouldShowOnboarding } from "@/actions/integrations.actions";
import { OnboardingWrapperProps } from "@/types/onboarding.types";

const ONBOARDING_DISMISSED_KEY = "sentiment-hound-onboarding-dismissed";

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user has previously dismissed onboarding
        const isDismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true";
        
        if (isDismissed) {
          setIsLoading(false);
          return;
        }

        // Check if user should see onboarding based on integrations
        const shouldShow = await shouldShowOnboarding();
        setShowOnboarding(shouldShow);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, don't show onboarding to avoid disrupting the user experience
        setShowOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // Remember that user dismissed onboarding
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
  };

  return (
    <>
      {children}
      <OnboardingModal
        opened={showOnboarding && !isLoading}
        onClose={handleOnboardingClose}
      />
    </>
  );
}