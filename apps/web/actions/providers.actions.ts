"use server";

import { Provider } from "@repo/db";
import { providerService } from "@repo/services";

interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

export async function getAllProviders(): Promise<ActionResponse<Provider[]>> {
  try {
    const data = await providerService.getAllProviders();
    // @ts-ignore
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
    };
  }
}
