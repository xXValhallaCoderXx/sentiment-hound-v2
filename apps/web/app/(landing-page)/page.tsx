import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";
import { FeaturesSection } from "./components/FeaturesSection";
import { CompetitiveSection } from "./components/CompetitiveSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { IconEye } from "@tabler/icons-react";
import { Stack, Group, Button } from "@mantine/core";
import { SpamDetectionSection } from "./components/SpamDetectionSection";
import { CommandCenterSection } from "./components/CommandCenterSection";
import { BeFirstToKnowSection } from "./components/BeFirstToKnowSection";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import classes from "./LandingPage.module.css";
import sectionStyles from "./components/SectionBackgrounds.module.css";

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
          <section id="home" className={sectionStyles.sectionPrimary}>
            <Hero />
          </section>
          <section id="early-access" className={sectionStyles.sectionAlt}>
            <BeFirstToKnowSection />
          </section>
          <Stack gap={96} id="features" className={classes.wrapper}>
            <div className={sectionStyles.sectionPrimary}>
              <CommandCenterSection />
            </div>
            <div className={sectionStyles.sectionAlt}>
              <SpamDetectionSection />
            </div>
          </Stack>
          <section id="how-it-works" className={sectionStyles.sectionPrimary}>
            <HowItWorksSection />
          </section>
          <section id="why-you-love" className={sectionStyles.sectionAlt}>
            <WhyTeamsLoveSection />
          </section>
          <section id="pricing" className={sectionStyles.sectionPrimary}>
            <PricingSection />
          </section>
          <section id="faq" className={sectionStyles.sectionAlt}>
            <FaqSection />
          </section>

          <Footer />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default LandingPage;
