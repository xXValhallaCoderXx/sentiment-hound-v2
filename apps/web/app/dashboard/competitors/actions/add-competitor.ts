"use server";

import { competitorService, planService } from "@repo/services";
import { revalidatePath } from "next/cache";

export async function addCompetitor(competitorName: string, userId: string) {
  try {
    // Check if user can create competitors based on their plan
    const canCreate = await planService.canUserCreateCompetitor(userId);
    
    if (!canCreate.canCreate) {
      return {
        success: false,
        error: canCreate.reason || "Cannot add competitor",
      };
    }

    // Create the competitor
    const competitor = await competitorService.createCompetitor({
      name: competitorName,
      userId,
    });

    // Start collecting sentiment data for the competitor
    // This would normally be done in a background job
    await competitorService.updateCompetitorSentimentDaily(competitor.id);

    revalidatePath("/dashboard/competitors");
    
    return {
      success: true,
      competitor,
    };
  } catch (error: any) {
    console.error("Error adding competitor:", error);
    
    if (error.message.includes("already exists")) {
      return {
        success: false,
        error: "You are already tracking this competitor",
      };
    }
    
    return {
      success: false,
      error: "Failed to add competitor. Please try again.",
    };
  }
}