"use server";

import { z } from "zod";
import { earlyAccessService } from "@repo/services";

const earlyAccessSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

export async function handleEarlyAccessSignup(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const rawData = {
      name: (formData.get("name") as string) || undefined,
      email: formData.get("email") as string,
    };

    const validatedData = earlyAccessSchema.parse(rawData);

    // Save to database (without headers for now - can be added later if needed)
    const result = await earlyAccessService.createSignup({
      name: validatedData.name,
      email: validatedData.email,
      // Note: IP address, user agent, and referrer tracking can be added
      // via middleware or other means if needed for analytics
    });

    if (!result.success) {
      return {
        error: result.error,
        alreadyExists: result.alreadyExists || false,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error:
          error.errors[0]?.message || "Please check your input and try again.",
      };
    }

    console.error("Early access signup error:", error);
    return {
      error: "Something went wrong. Please try again later.",
    };
  }
}
