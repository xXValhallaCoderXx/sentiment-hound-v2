import { PrismaClient } from "@repo/db";

export interface ValidateTokenResult {
  isValid: boolean;
  planId?: number;
  error?: string;
}

export class InvitationTokenService {
  constructor(private prisma: PrismaClient) {}

  async validateToken(token: string): Promise<ValidateTokenResult> {
    if (!token || token.trim() === "") {
      return { isValid: false, error: "Token is required" };
    }

    try {
      // Find the token
      const invitationToken = await this.prisma.invitationToken.findUnique({
        where: { token: token.trim() },
        include: { planToAssign: true },
      });

      if (!invitationToken) {
        return { isValid: false, error: "Invalid invitation token" };
      }

      // Check if token is already used
      if (invitationToken.status === "USED") {
        return {
          isValid: false,
          error: "This invitation token has already been used",
        };
      }

      // Check if token is expired
      if (
        invitationToken.status === "EXPIRED" ||
        (invitationToken.expiresAt && new Date() > invitationToken.expiresAt)
      ) {
        return { isValid: false, error: "This invitation token has expired" };
      }

      // Return success with the plan ID
      return {
        isValid: true,
        planId: invitationToken.planToAssignId,
      };
    } catch (error) {
      console.error("Error validating invitation token:", error);
      return { isValid: false, error: "Failed to validate token" };
    }
  }

  async consumeInvitationToken(
    token: string,
    userId: string,
  ): Promise<ValidateTokenResult> {
    if (!token || token.trim() === "") {
      return { isValid: false, error: "Token is required" };
    }

    try {
      // Start a transaction to ensure atomicity
      return await this.prisma.$transaction(async (tx) => {
        // Find the token
        const invitationToken = await tx.invitationToken.findUnique({
          where: { token: token.trim() },
          include: { planToAssign: true },
        });

        if (!invitationToken) {
          return { isValid: false, error: "Invalid invitation token" };
        }

        // Check if token is already used
        if (invitationToken.status === "USED") {
          return {
            isValid: false,
            error: "This invitation token has already been used",
          };
        }

        // Check if token is expired
        if (
          invitationToken.status === "EXPIRED" ||
          (invitationToken.expiresAt && new Date() > invitationToken.expiresAt)
        ) {
          // Update token status to EXPIRED if it's not already
          if (invitationToken.status !== "EXPIRED") {
            await tx.invitationToken.update({
              where: { id: invitationToken.id },
              data: { status: "EXPIRED" },
            });
          }

          return { isValid: false, error: "This invitation token has expired" };
        }

        // Mark the token as used and associate it with the user
        await tx.invitationToken.update({
          where: { id: invitationToken.id },
          data: {
            status: "USED",
            redeemedAt: new Date(),
            redeemedByUserId: userId,
          },
        });

        // Return success with the plan ID
        return {
          isValid: true,
          planId: invitationToken.planToAssignId,
        };
      });
    } catch (error) {
      console.error("Error consuming invitation token:", error);
      return { isValid: false, error: "Failed to validate token" };
    }
  }

  async generateToken(
    planId: number,
    options?: {
      expiresInDays?: number;
    },
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // Generate a secure random token
      const tokenValue = this.generateSecureToken();

      // Calculate expiration date (default: 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (options?.expiresInDays || 7));

      // Create the token
      const token = await this.prisma.invitationToken.create({
        data: {
          token: tokenValue,
          planToAssignId: planId,
          expiresAt,
          status: "PENDING",
        },
      });

      return { success: true, token: token.token };
    } catch (error: any) {
      console.error("Error generating invitation token:", error);

      if (error.code === "P2002") {
        return {
          success: false,
          error: "Token collision occurred. Please try again.",
        };
      }

      return { success: false, error: "Failed to generate token" };
    }
  }

  private generateSecureToken(): string {
    // Generate a random string of characters for the token
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const tokenLength = 32; // 32 characters should be secure enough
    let token = "";

    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    return token;
  }
}
