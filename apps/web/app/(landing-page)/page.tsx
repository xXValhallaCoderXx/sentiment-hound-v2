import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import { Hero } from "@/components/organisms/Hero";
import { FeaturesSection } from "./components/FeaturesSection";
import { CompetitiveSection } from "./components/CompetitiveSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { IconEye } from "@tabler/icons-react";
import { Stack, Group, Button } from "@mantine/core";
import { SpamDetectionSection } from "./components/SpamDetectionSection";
import { CommandCenterSection } from "./components/CommandCenterSection";
import { BeFirstToKnowSection } from "./components/BeFirstToKnowSection";

import sectionClasses from "./SectionBackgrounds.module.css";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <PublicPageLayout>
      <section id="home" className={sectionClasses.sectionPrimary}>
        <Hero />
      </section>
      <section id="early-access" className={sectionClasses.sectionAlt}>
        <BeFirstToKnowSection />
      </section>
      <Stack
        gap={96}
        id="features"
        className={`${sectionClasses.wrapper} ${sectionClasses.sectionPrimary}`}
      >
        <CommandCenterSection />
        <SpamDetectionSection />
      </Stack>
      <section id="how-it-works" className={sectionClasses.sectionAlt}>
        <HowItWorksSection />
      </section>
      <section id="why-you-love" className={sectionClasses.sectionPrimary}>
        <WhyTeamsLoveSection />
      </section>
      
      <section id="faq" className={sectionClasses.sectionPrimary}>
        <FaqSection />
      </section>
    </PublicPageLayout>
  );
};

export default LandingPage;
