import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { Hero } from "@/components/organisms/Hero";
import { FaqSection } from "./components/FaqSection";
// MainFeaturesSection and SubFeaturesSection imports are removed
import { Footer } from "./components/Footer";

// Imports for the new sections
import { BentoGridSection } from "./components/BentoGridSection";
import { SocialProofSection } from "./components/SocialProofSection";
import { FinalCTASection } from "./components/FinalCTASection";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <Hero />
      <BentoGridSection />
      <SocialProofSection />
      <FaqSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
