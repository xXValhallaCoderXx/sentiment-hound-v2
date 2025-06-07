"use server";

import { signIn } from "@/lib/next-auth.lib";
import { prisma } from "@repo/db";
import { invitationCodeService } from "@repo/services";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1, "Name is required").optional(),
  invitationCode: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function handleGoogleSignIn() {
  await signIn("google");
}

export async function handleGoogleSignInWithCode(invitationCode?: string) {
  // Store invitation code in localStorage before redirect
  if (invitationCode && typeof window !== "undefined") {
    localStorage.setItem("pendingInvitationCode", invitationCode);
  }
  await signIn("google");
}

export async function handleEmailSignUp(prevState: any, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      invitationCode: formData.get("invitationCode") as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        error: "An account with this email already exists. Please sign in.",
      };
    }

    // Validate invitation code if provided
    let planId: number | undefined;
    if (validatedData.invitationCode && validatedData.invitationCode.trim() !== "") {
      const codeValidation = await invitationCodeService.validateCode(validatedData.invitationCode);
      if (!codeValidation.isValid) {
        return {
          error: codeValidation.error || "Invalid invitation code",
        };
      }
      planId = codeValidation.planId;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Get default plan (trial) if no invitation code provided
    if (!planId) {
      const trialPlan = await prisma.plan.findUnique({ where: { name: "trial" } });
      planId = trialPlan?.id;
    }

    // Create user
    await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || null,
        planId,
      },
    });

    // Redeem invitation code if provided
    if (validatedData.invitationCode && validatedData.invitationCode.trim() !== "") {
      await invitationCodeService.redeemCode(validatedData.invitationCode);
    }

    // Sign in the user
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        error: "Failed to sign in after registration. Please try signing in manually.",
      };
    }

    // Redirect on success
    redirect("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0]?.message || "Validation failed",
      };
    }

    console.error("Sign up error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function handleEmailSignIn(prevState: any, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signInSchema.parse(rawData);

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        error: "Invalid email or password",
      };
    }

    // Redirect on success
    redirect("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0]?.message || "Validation failed",
      };
    }

    console.error("Sign in error:", error);
    return {
      error: "Invalid email or password",
    };
  }
}

export async function handleForgotPassword(prevState: any, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = forgotPasswordSchema.parse(rawData);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Always return success to prevent email enumeration
    // In a real implementation, you would send an email here
    console.log(`Password reset requested for: ${validatedData.email}`);

    return {
      success: true,
      message: "If an account with this email exists, you will receive a password reset link.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0]?.message || "Validation failed",
      };
    }

    console.error("Forgot password error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
