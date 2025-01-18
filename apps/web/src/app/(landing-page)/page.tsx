import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";
import { FaqSection } from "./components/FaqSection";
import { MainFeaturesSection } from "./components/MainFeaturesSection";
import { SubFeaturesSection } from "./components/SubFeaturesSection";
import { Footer } from "./components/Footer";

export default async function Home() {
  const session = await auth();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <NavigationMenu />
      <div className="mt-20">
        <Hero />

        <MainFeaturesSection />
        <SubFeaturesSection />
        <FaqSection />
        <Footer />
      </div>
    </main>
  );
}
