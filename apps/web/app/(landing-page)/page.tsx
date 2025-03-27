import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { Hero } from "@/components/organisms/Hero";
import { FaqSection } from "./components/FaqSection";
import { MainFeaturesSection } from "./components/MainFeaturesSection";
import { SubFeaturesSection } from "./components/SubFeaturesSection";
import { Footer } from "./components/Footer";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <Hero />

      <MainFeaturesSection />
      <SubFeaturesSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
