import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhyTeamsLoveSection } from "./components/WhyTeamsLoveSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { BeFirstToKnowSection } from "./components/BeFirstToKnowSection";
import { YourCommandCenterFeaturesSection } from "./components/YourCommandCenterFeaturesSection";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";

const LandingPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <AppShell header={{ height: 70 }}>
        <AppShellHeader>
          <NavigationMenu />
        </AppShellHeader>
        <AppShellMain style={{ padding: 0 }}>
          <section id="home">
            <Hero />
          </section>
          <section id="features">
            <YourCommandCenterFeaturesSection />
          </section>
          <section id="how-it-works">
            <HowItWorksSection />
          </section>
          <section id="why-sentiment-hound">
            <WhyTeamsLoveSection />
          </section>
          <section id="pricing">
            <PricingSection />
          </section>
          <section id="faq">
            <FaqSection />
          </section>
          <section id="early-access">
            <BeFirstToKnowSection />
          </section>
          <Footer />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default LandingPage;
