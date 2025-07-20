"use server";

import { signIn } from "@/lib/next-auth.lib";
import { prisma } from "@repo/db";
import { invitationTokenService, PlanName } from "@repo/services";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().nullable().optional(),
  invitationToken: z.string().nullable().optional(),
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

export async function handleGoogleSignInWithToken(invitationToken?: string) {
  // Store invitation token in localStorage before redirect
  if (invitationToken && typeof window !== "undefined") {
    localStorage.setItem("pendingInvitationToken", invitationToken);
  }
  await signIn("google");
}

export async function handleEmailSignUp(prevState: any, formData: FormData) {
  try {
    // Step A: Read Form Data
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      invitationToken: formData.get("invitationToken") as string,
    };

    const validatedData = signUpSchema.parse(rawData);

    // Step B: Conditional Token Validation (The Feature Flag)
    const requiresInvitation =
      process.env.SIGNUPS_REQUIRE_INVITATION === "true";
    let planId: number | undefined;

    // Validate invitation token if provided
    if (
      validatedData.invitationToken &&
      validatedData.invitationToken.trim() !== ""
    ) {
      // Check if token exists and is valid without consuming it
      const tokenCheck = await prisma.invitationToken.findUnique({
        where: { token: validatedData.invitationToken.trim() },
        include: { planToAssign: true },
      });

      if (!tokenCheck) {
        return {
          error: "Invalid invitation token.",
        };
      }

      if (tokenCheck.status === "USED") {
        return {
          error: "This invitation token has already been used.",
        };
      }

      if (
        tokenCheck.status === "EXPIRED" ||
        (tokenCheck.expiresAt && new Date() > tokenCheck.expiresAt)
      ) {
        return {
          error: "This invitation token has expired.",
        };
      }

      planId = tokenCheck.planToAssignId;
    } else if (requiresInvitation) {
      // When flag is true, invitation token is mandatory
      return {
        error: "A valid invitation token is required.",
      };
    }

    // Step C: User Existence Check
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        error: "An account with this email already exists. Please sign in.",
      };
    }

    // Step D: Password Hashing
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Get default plan (trial) if no plan was assigned from invitation token
    if (!planId) {
      const trialPlan = await prisma.plan.findUnique({
        where: { name: PlanName.TRIAL },
      });
      planId = trialPlan?.id;
    }

    // Step E: User Creation
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || null,
        planId,
      },
    });

    // Consume the invitation token now that we have a real user ID
    if (
      validatedData.invitationToken &&
      validatedData.invitationToken.trim() !== ""
    ) {
      await prisma.invitationToken.update({
        where: { token: validatedData.invitationToken.trim() },
        data: {
          status: "USED",
          redeemedAt: new Date(),
          redeemedByUserId: user.id,
        },
      });
    }

    // Step F: Post-Creation Sign-In
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        error:
          "Failed to sign in after registration. Please try signing in manually.",
      };
    }

    // Return success without redirecting - let the client handle the redirect
    return {
      success: true,
      message: "Account created successfully! Redirecting to dashboard...",
      redirectTo: "/dashboard",
    };
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

    console.log("� Sign-in attempt:", {
      email: rawData.email,
      hasPassword: !!rawData.password,
      passwordLength: rawData.password?.length || 0,
    });

    const validatedData = signInSchema.parse(rawData);

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    console.log("🔑 SignIn result:", {
      error: result?.error,
      ok: result?.ok,
      status: result?.status,
      url: result?.url,
    });

    if (result?.error) {
      return {
        error: "Invalid email or password",
      };
    }

    // Return success and let the client handle the redirect
    return {
      success: true,
      redirectTo: "/dashboard",
    };
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
      message:
        "If an account with this email exists, you will receive a password reset link.",
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
