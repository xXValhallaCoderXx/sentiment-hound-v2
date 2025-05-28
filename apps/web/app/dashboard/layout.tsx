import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";
import DashboardLayout from "@/components/templates/DashboardLayout";



const AuthenticatedLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AuthenticatedLayout;
