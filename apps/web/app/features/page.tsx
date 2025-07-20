import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import AnimatedSection from "@/components/atoms/AnimatedSection/AnimatedSection";
import ScrollHandler from "../(landing-page)/components/ScrollHandler";

// Feature page components
import FeaturesHero from "./components/FeaturesHero";
import HowItWorksOverview from "./components/HowItWorksOverview";
import CommandCenterFeature from "./components/CommandCenterFeature";
import SpamDetectionFeature from "./components/SpamDetectionFeature";
import CompetitorAnalysisFeature from "./components/CompetitorAnalysisFeature";
import FeaturesCallToAction from "./components/FeaturesCallToAction";

import classes from "./FeaturesPage.module.css";

const FeaturesPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <PublicPageLayout>
      {/* Living Canvas Background - Fixed Layer */}
      <div className={classes.livingCanvasBackground}>
        <div className={classes.glow1}></div>
        <div className={classes.glow2}></div>
        <div className={classes.glow3}></div>
      </div>

      {/* Content Layer - Scrollable */}
      <main className={classes.contentLayer}>
        <ScrollHandler />

        <AnimatedSection>
          <section className={classes.section}>
            <FeaturesHero />
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className={classes.howItWorksSection}>
            <HowItWorksOverview />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section className={classes.section}>
            <CommandCenterFeature />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section className={classes.section}>
            <SpamDetectionFeature />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section className={classes.section}>
            <CompetitorAnalysisFeature />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section className={classes.section}>
            <FeaturesCallToAction />
          </section>
        </AnimatedSection>
      </main>
    </PublicPageLayout>
  );
};

export default FeaturesPage;
