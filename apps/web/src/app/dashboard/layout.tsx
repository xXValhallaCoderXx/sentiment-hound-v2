import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";
import DashboardLayout from "@/components/templates/DashboardLayout";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

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
