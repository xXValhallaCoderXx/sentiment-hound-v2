import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import ModernHero from "@/components/organisms/ModernHero/ModernHero";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { FaqSection } from "./components/FaqSection";
import { Stack } from "@mantine/core";
import { SpamDetectionSection } from "./components/SpamDetectionSection";
import { CommandCenterSection } from "./components/CommandCenterSection";
import PlansAndEarlyAccessSection from "./components/PlansAndEarlyAccessSection";
import AnimatedSection from "@/components/atoms/AnimatedSection/AnimatedSection";

import sectionClasses from "./SectionBackgrounds.module.css";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <PublicPageLayout>
      <section id="home" className={sectionClasses.sectionPrimary}>
        <ModernHero />
      </section>
      <AnimatedSection>
        <Stack
          gap={96}
          id="features"
          className={`${sectionClasses.wrapper} ${sectionClasses.sectionPrimary}`}
        >
          <CommandCenterSection />
          <SpamDetectionSection />
        </Stack>
      </AnimatedSection>
      <AnimatedSection>
        <section id="plans-early-access" className={sectionClasses.sectionAlt}>
          <PlansAndEarlyAccessSection />
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section id="how-it-works" className={sectionClasses.sectionPrimary}>
          <HowItWorksSection />
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section id="why-you-love" className={sectionClasses.sectionAlt}>
          <WhyTeamsLoveSection />
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section id="faq" className={sectionClasses.sectionPrimary}>
          <FaqSection />
        </section>
      </AnimatedSection>
    </PublicPageLayout>
  );
};

export default LandingPage;
