"use client";
import { Button } from "@/components/ui/button";
import { userService } from "services";
import { signOut } from "@/lib/next-auth.lib";

const DashboardPage = () => {
  const handleSignOut = async () => {
    // await signOut();
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={handleSignOut}>DASHBOARD</Button>
    </main>
  );
};

export default DashboardPage;
