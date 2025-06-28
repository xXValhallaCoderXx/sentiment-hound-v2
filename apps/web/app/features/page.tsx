import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import { Stack } from "@mantine/core";
import AnimatedSection from "@/components/atoms/AnimatedSection/AnimatedSection";

// Feature page components
import FeaturesHero from "./components/FeaturesHero";
import HowItWorksOverview from "./components/HowItWorksOverview";
import CommandCenterFeature from "./components/CommandCenterFeature";
import SpamDetectionFeature from "./components/SpamDetectionFeature";
import CompetitorAnalysisFeature from "./components/CompetitorAnalysisFeature";
import FeaturesCallToAction from "./components/FeaturesCallToAction";

import sectionClasses from "../(landing-page)/SectionBackgrounds.module.css";

const FeaturesPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <PublicPageLayout>
      <AnimatedSection>
        <section className={sectionClasses.sectionPrimary}>
          <FeaturesHero />
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={sectionClasses.sectionAlt}>
          <HowItWorksOverview />
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={sectionClasses.sectionPrimary}>
          <CommandCenterFeature />
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={sectionClasses.sectionAlt}>
          <SpamDetectionFeature />
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={sectionClasses.sectionPrimary}>
          <CompetitorAnalysisFeature />
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={sectionClasses.sectionAlt}>
          <FeaturesCallToAction />
        </section>
      </AnimatedSection>
    </PublicPageLayout>
  );
};

export default FeaturesPage;