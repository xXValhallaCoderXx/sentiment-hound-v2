import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { CommandCenterSection } from "./components/CommandCenterSection";
import { SpamDetectionSection } from "./components/SpamDetectionSection";
import { CompetitiveSection } from "./components/CompetitiveSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { SignUpToInsightSection } from "./components/SignUpToInsightSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <AppShell header={{ height: 70 }}>
        <AppShellHeader>
          <NavigationMenu />
        </AppShellHeader>
        <AppShellMain style={{ padding: 0 }}>
          <Hero />
          <HowItWorksSection />
          <CommandCenterSection />
          <SpamDetectionSection />
          <CompetitiveSection />
          <WhyTeamsLoveSection />
          <SignUpToInsightSection />
          <PricingSection />
          <FaqSection />
          <Footer />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default LandingPage;
