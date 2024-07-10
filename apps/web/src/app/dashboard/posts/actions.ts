"use server";
import { auth } from "@/lib/next-auth.lib";

export const fetchContent = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
};
