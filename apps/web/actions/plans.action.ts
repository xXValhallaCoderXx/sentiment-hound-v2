"use server";

import { Plan } from "@repo/db";
import { planService } from "@repo/services";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";

interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

interface IAddUserToPlan {
  userId: string;
  planId: string;
}

export async function addUserToPlan(formData: FormData): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  const planId = formData.get("planId") as string;
  try {
    await planService.addUserToPlan(planId, String(userId));
    redirect("/dashboard/profile?status=success");
  } catch (error: any) {
    console.error("Error adding user to plan:", error);
    redirect("/dashboard/profile?status=error");
  }
}
