"use server";

import { competitorService } from "@repo/services";
import { revalidatePath } from "next/cache";

export async function deleteCompetitor(competitorId: number, userId: string) {
  try {
    await competitorService.deleteCompetitor(competitorId, userId);
    revalidatePath("/dashboard/competitors");
    
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error deleting competitor:", error);
    
    return {
      success: false,
      error: "Failed to delete competitor. Please try again.",
    };
  }
}