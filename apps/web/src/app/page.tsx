import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/next-auth.lib";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Hero } from "@/components/organisms/Hero";

export default async function Home() {
  const session = await auth();
  if (session) {
    return redirect("/app/dashboard");
  }

  return (
    <main className="min-h-screen">
      <NavigationMenu />
      <div className="mt-20">
        <Hero />
        sss
      </div>
    </main>
  );
}
