import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import PlansAndEarlyAccessSection from "../(landing-page)/components/PlansAndEarlyAccessSection";
import AnimatedSection from "@/components/atoms/AnimatedSection/AnimatedSection";
import ScrollHandler from "../(landing-page)/components/ScrollHandler";

import sectionClasses from "../(landing-page)/SectionBackgrounds.module.css";

const PricingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <PublicPageLayout>
      <ScrollHandler />
      <AnimatedSection>
        <section className={sectionClasses.sectionPrimary}>
          <PlansAndEarlyAccessSection />
        </section>
      </AnimatedSection>
    </PublicPageLayout>
  );
};

export default PricingPage;
