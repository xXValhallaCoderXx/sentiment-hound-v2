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
    const requiresInvitation = process.env.SIGNUPS_REQUIRE_INVITATION === 'true';
    let planId: number | undefined;

    if (requiresInvitation) {
      // When flag is true, invitation token is mandatory
      if (!validatedData.invitationToken || validatedData.invitationToken.trim() === "") {
        return {
          error: "A valid invitation token is required.",
        };
      }

      // Validate and consume the invitation token
      const tokenValidation = await invitationTokenService.consumeInvitationToken(
        validatedData.invitationToken,
        "pending-user" // Will be updated after user creation
      );
      
      if (!tokenValidation.isValid) {
        return {
          error: tokenValidation.error || "A valid invitation token is required.",
        };
      }
      
      planId = tokenValidation.planId;
    } else {
      // When flag is false, token is optional but still processed if provided
      if (validatedData.invitationToken && validatedData.invitationToken.trim() !== "") {
        const tokenValidation = await invitationTokenService.consumeInvitationToken(
          validatedData.invitationToken,
          "pending-user"
        );
        
        if (tokenValidation.isValid) {
          planId = tokenValidation.planId;
        }
        // If token is invalid when flag is false, we ignore it and continue
      }
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

    // Update the token with the actual user ID if a token was used
    if (validatedData.invitationToken && validatedData.invitationToken.trim() !== "") {
      await prisma.invitationToken.updateMany({
        where: { 
          token: validatedData.invitationToken.trim(),
          redeemedByUserId: "pending-user"
        },
        data: { 
          redeemedByUserId: user.id 
        }
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
