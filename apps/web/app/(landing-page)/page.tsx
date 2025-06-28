import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import ModernHero from "@/components/organisms/ModernHero/ModernHero";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { FaqSection } from "./components/FaqSection";
import PlansAndEarlyAccessSection from "./components/PlansAndEarlyAccessSection";
import CoreFeaturesSection from "./components/CoreFeaturesSection";
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
        <section id="core-features" className={sectionClasses.sectionAlt}>
          <CoreFeaturesSection />
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section
          id="plans-early-access"
          className={sectionClasses.sectionPrimary}
        >
          <PlansAndEarlyAccessSection />
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="why-you-love" className={sectionClasses.sectionPrimary}>
          <WhyTeamsLoveSection />
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section id="faq" className={sectionClasses.sectionAlt}>
          <FaqSection />
        </section>
      </AnimatedSection>
    </PublicPageLayout>
  );
};

export default LandingPage;
