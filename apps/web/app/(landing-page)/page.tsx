import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";
import { FeaturesSection } from "./components/FeaturesSection";
import { CompetitiveSection } from "./components/CompetitiveSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { IconEye } from "@tabler/icons-react";
import { Stack, Group, Button } from "@mantine/core";
import { SpamDetectionSection } from "./components/SpamDetectionSection";
import { CommandCenterSection } from "./components/CommandCenterSection";
import { BeFirstToKnowSection } from "./components/BeFirstToKnowSection";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import classes from "./LandingPage.module.css";

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
          <section id="home">
            <Hero />
          </section>
          <section id="early-access">
            <BeFirstToKnowSection />
          </section>
          <Stack gap={96} id="features" className={classes.wrapper}>
            <CommandCenterSection />
            <SpamDetectionSection />
          </Stack>
          <section id="how-it-works">
            <HowItWorksSection />
          </section>
          <section id="why-you-love">
            <WhyTeamsLoveSection />
          </section>
          <section id="faq">
            <FaqSection />
          </section>

          <Footer />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default LandingPage;
