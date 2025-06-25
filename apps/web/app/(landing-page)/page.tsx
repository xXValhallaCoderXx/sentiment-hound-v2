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
import sectionClasses from "./SectionBackgrounds.module.css";

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
          <section id="home" className={sectionClasses.sectionPrimary}>
            <Hero />
          </section>
          <section id="early-access" className={sectionClasses.sectionAlt}>
            <BeFirstToKnowSection />
          </section>
          <Stack gap={96} id="features" className={`${classes.wrapper} ${sectionClasses.sectionPrimary}`}>
            <CommandCenterSection />
            <SpamDetectionSection />
          </Stack>
          <section id="how-it-works" className={sectionClasses.sectionAlt}>
            <HowItWorksSection />
          </section>
          <section id="why-you-love" className={sectionClasses.sectionPrimary}>
            <WhyTeamsLoveSection />
          </section>
          <section id="pricing" className={sectionClasses.sectionAlt}>
            <PricingSection />
          </section>
          <section id="faq" className={sectionClasses.sectionPrimary}>
            <FaqSection />
          </section>

          <div className={sectionClasses.sectionAlt}>
            <Footer />
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default LandingPage;
