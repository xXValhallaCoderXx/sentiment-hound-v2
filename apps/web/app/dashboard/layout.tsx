// import type { Metadata } from "next"; // Unused
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";
import DashboardLayout from "@/components/templates/DashboardLayout";

const AuthenticatedLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();

  console.log("📊 Dashboard layout - Session check:", {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    expires: session?.expires,
  });

  if (!session) {
    console.log("❌ No session found, redirecting to homepage");
    redirect("/");
  }

  console.log("✅ Session found, rendering dashboard");
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AuthenticatedLayout;
