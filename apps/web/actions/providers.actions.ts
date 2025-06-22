"use server";

import { Provider } from "@repo/db";
import { providerService } from "@repo/services";
import { ActionResponse, createErrorResponse } from "@/lib/types";

export async function getAllProviders(): Promise<ActionResponse<Provider[]>> {
  try {
    const data = await providerService.getAllProviders();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}
