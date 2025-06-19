import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { Navigation } from "./components/Navigation";
import { NewHero } from "./components/NewHero";
import { SocialProofLogos } from "./components/SocialProofLogos";
import { ProblemSolution } from "./components/ProblemSolution";
import { KeyFeatures } from "./components/KeyFeatures";
import { DeeperDive } from "./components/DeeperDive";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FinalCta } from "./components/FinalCta";
import { NewFooter } from "./components/NewFooter";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <Navigation />
      <NewHero />
      <SocialProofLogos />
      <ProblemSolution />
      <KeyFeatures />
      <DeeperDive />
      <TestimonialsSection />
      <FinalCta />
      <NewFooter />
    </div>
  );
};

export default LandingPage;
