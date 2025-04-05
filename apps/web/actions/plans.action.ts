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

  planId: string;
}

export async function addUserToPlan(data: IAddUserToPlan): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  const planId = data.planId;

  try {
    await planService.addUserToPlan(planId, String(userId));
    return true;
  } catch (error: any) {
    console.error("Error adding user to plan:", error);
    return false;
  }
}
