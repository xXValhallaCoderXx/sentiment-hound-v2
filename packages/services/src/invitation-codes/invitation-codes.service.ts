import { PrismaClient } from "@repo/db";

export interface ValidateCodeResult {
  isValid: boolean;
  planId?: number;
  error?: string;
}

export class InvitationCodeService {
  constructor(private prisma: PrismaClient) {}

  async validateCode(code: string): Promise<ValidateCodeResult> {
    if (!code || code.trim() === "") {
      return { isValid: false, error: "Code is required" };
    }

    try {
      const invitationCode = await this.prisma.invitationCode.findUnique({
        where: { code: code.trim().toUpperCase() },
        include: { plan: true },
      });

      if (!invitationCode) {
        return { isValid: false, error: "Invalid invitation code" };
      }

      if (!invitationCode.isActive) {
        return { isValid: false, error: "This invitation code is no longer active" };
      }

      if (invitationCode.expiresAt && new Date() > invitationCode.expiresAt) {
        return { isValid: false, error: "This invitation code has expired" };
      }

      if (invitationCode.maxUses && invitationCode.timesUsed >= invitationCode.maxUses) {
        return { isValid: false, error: "This invitation code has reached its usage limit" };
      }

      return { 
        isValid: true, 
        planId: invitationCode.planId || undefined
      };
    } catch (error) {
      console.error("Error validating invitation code:", error);
      return { isValid: false, error: "Failed to validate code" };
    }
  }

  async redeemCode(code: string): Promise<{ success: boolean; planId?: number; error?: string }> {
    const validation = await this.validateCode(code);
    
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      // Increment usage count
      const updatedCode = await this.prisma.invitationCode.update({
        where: { code: code.trim().toUpperCase() },
        data: { timesUsed: { increment: 1 } },
      });

      return { 
        success: true, 
        planId: validation.planId
      };
    } catch (error) {
      console.error("Error redeeming invitation code:", error);
      return { success: false, error: "Failed to redeem code" };
    }
  }

  async generateCode(
    code: string,
    planId: number,
    options?: {
      maxUses?: number;
      expiresAt?: Date;
      discountType?: string;
      discountValue?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.prisma.invitationCode.create({
        data: {
          code: code.toUpperCase(),
          planId,
          maxUses: options?.maxUses,
          expiresAt: options?.expiresAt,
          discountType: options?.discountType,
          discountValue: options?.discountValue,
          isActive: true,
          timesUsed: 0,
        },
      });

      return { success: true };
    } catch (error: any) {
      console.error("Error generating invitation code:", error);
      
      if (error.code === "P2002") {
        return { success: false, error: "This invitation code already exists" };
      }
      
      return { success: false, error: "Failed to generate code" };
    }
  }
}