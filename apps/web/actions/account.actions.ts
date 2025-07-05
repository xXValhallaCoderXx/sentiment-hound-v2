"use server";

import { auth, signOut } from "@/lib/next-auth.lib";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

/**
 * Server action result type for account operations
 */
export interface AccountActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Server action to delete a user account and all associated data
 * This is a destructive operation that cannot be undone
 */
export async function deleteAccount(): Promise<AccountActionResult> {
  try {
    // Get the current session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        error: "You must be signed in to delete your account.",
      };
    }

    const userId = session.user.id;

    // Use a transaction to ensure all deletions succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete tracked keywords
      await tx.trackedKeyword.deleteMany({
        where: { userId },
      });

      // Delete competitors
      await tx.competitor.deleteMany({
        where: { userId },
      });

      // Delete user posts and related data
      await tx.post.deleteMany({
        where: { userId },
      });

      // Delete tasks
      await tx.task.deleteMany({
        where: { userId },
      });

      // Delete user integrations
      await tx.integration.deleteMany({
        where: { userId },
      });

      // Delete any user-specific tokens or sessions
      await tx.account.deleteMany({
        where: { userId },
      });

      await tx.session.deleteMany({
        where: { userId },
      });

      // Update invitation tokens redeemed by this user
      await tx.invitationToken.updateMany({
        where: { redeemedByUserId: userId },
        data: { redeemedByUserId: null },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // Sign out the user after successful deletion
    await signOut({ redirect: false });

    return {
      success: true,
      message: "Your account has been permanently deleted.",
    };
  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      error: "Failed to delete account. Please try again or contact support.",
    };
  }
}

/**
 * Server action to sign out the current user
 * Used for logout confirmation flow
 */
export async function logoutUser(): Promise<AccountActionResult> {
  try {
    // Get the current session to verify user is signed in
    const session = await auth();
    if (!session?.user?.id) {
      return {
        error: "No active session found.",
      };
    }

    // Sign out the user
    await signOut({ redirect: false });

    // Revalidate any cached pages
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Successfully logged out.",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      error: "Failed to log out. Please try again.",
    };
  }
}

/**
 * Server action to get current user account information
 * Used to populate account management components
 */
export async function getCurrentUserAccount(): Promise<
  AccountActionResult & {
    user?: {
      id: string;
      email: string;
      name: string | null;
      plan: { id: number; name: string } | null;
      integrationCount: number;
      keywordCount: number;
      createdAt: Date;
    };
  }
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        error: "You must be signed in to view account information.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        plan: true,
        integrations: {
          select: {
            id: true,
            accountId: true,
            isActive: true,
          },
        },
        trackedKeywords: {
          select: {
            id: true,
            keyword: true,
          },
        },
      },
    });

    if (!user) {
      return {
        error: "User account not found.",
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        integrationCount: user.integrations.length,
        keywordCount: user.trackedKeywords.length,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error("Get user account error:", error);
    return {
      error: "Failed to load account information.",
    };
  }
}
