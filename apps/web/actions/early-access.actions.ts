import { z } from "zod";

const earlyAccessSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

export async function handleEarlyAccessSignup(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawData = {
      name: (formData.get("name") as string) || undefined,
      email: formData.get("email") as string,
    };

    const validatedData = earlyAccessSchema.parse(rawData);

    // TODO: Replace with actual database integration
    // For now, we'll just log the data
    console.log("Early access signup:", validatedData);

    // In a real implementation, you would:
    // 1. Save to database (e.g., earlyAccessSignups table)
    // 2. Send welcome email
    // 3. Add to email marketing list
    // 4. Track analytics event

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Thank you! You've been added to our early access list.",
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
