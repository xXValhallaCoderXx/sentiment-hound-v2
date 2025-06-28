import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import ModernHero from "@/components/organisms/ModernHero/ModernHero";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { FaqSection } from "./components/FaqSection";
import PlansAndEarlyAccessSection from "./components/PlansAndEarlyAccessSection";
import CoreFeaturesSection from "./components/CoreFeaturesSection";
import AnimatedSection from "@/components/atoms/AnimatedSection/AnimatedSection";
import ScrollHandler from "./components/ScrollHandler";

import classes from "./LandingPage.module.css";

const LandingPage = async () => {
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
        
        <section id="home" className={classes.section}>
          <ModernHero />
        </section>
        
        <AnimatedSection>
          <section id="core-features" className={classes.toolkitSection}>
            <CoreFeaturesSection />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section id="plans-early-access" className={classes.section}>
            <PlansAndEarlyAccessSection />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section id="why-you-love" className={classes.section}>
            <WhyTeamsLoveSection />
          </section>
        </AnimatedSection>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        <AnimatedSection>
          <section id="faq" className={classes.section}>
            <FaqSection />
          </section>
        </AnimatedSection>
      </main>
    </PublicPageLayout>
  );
};

export default LandingPage;
