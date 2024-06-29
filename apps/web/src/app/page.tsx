import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/next-auth.lib";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";

export default async function Home() {
  const session = await auth();
  if (session) {
    return redirect("/app/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavigationMenu />
    </main>
  );
}
