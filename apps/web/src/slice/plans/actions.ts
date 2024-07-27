"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/next-auth.lib";
import { planService } from "services";

export const upgradePlanAction = async (formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  if (!formData.get("planId")) {
    throw new Error("Plan not found");
  }
  const rawFormData = {
    planId: formData.get("planId"),
  };

  const result = await planService.updatePlan(
    userId,
    rawFormData.planId as string
  );

  console.log("PLAN UPDATED", result);
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?planUpdated=true");
};
