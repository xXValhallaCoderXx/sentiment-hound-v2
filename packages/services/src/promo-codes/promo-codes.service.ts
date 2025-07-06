import { PrismaClient } from "@repo/db";

export interface ValidatePromoCodeResult {
  isValid: boolean;
  discountType?: string;
  discountValue?: number;
  error?: string;
}

export class PromoCodeService {
  constructor(private prisma: PrismaClient) {}

  async validateCode(code: string): Promise<ValidatePromoCodeResult> {
    if (!code || code.trim() === "") {
      return { isValid: false, error: "Code is required" };
    }

    try {
      const promoCode = await this.prisma.promoCode.findUnique({
        where: { code: code.trim().toUpperCase() },
      });

      if (!promoCode) {
        return { isValid: false, error: "Invalid promo code" };
      }

      if (!promoCode.isActive) {
        return { isValid: false, error: "This promo code is no longer active" };
      }

      if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
        return { isValid: false, error: "This promo code has expired" };
      }

      if (promoCode.maxUses && promoCode.timesUsed >= promoCode.maxUses) {
        return { isValid: false, error: "This promo code has reached its usage limit" };
      }

      return { 
        isValid: true, 
        discountType: promoCode.discountType || undefined,
        discountValue: promoCode.discountValue ? parseFloat(promoCode.discountValue.toString()) : undefined
      };
    } catch (error) {
      console.error("Error validating promo code:", error);
      return { isValid: false, error: "Failed to validate code" };
    }
  }

  async redeemCode(code: string): Promise<{ success: boolean; discountType?: string; discountValue?: number; error?: string }> {
    const validation = await this.validateCode(code);
    
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      // Increment usage count
      const updatedCode = await this.prisma.promoCode.update({
        where: { code: code.trim().toUpperCase() },
        data: { timesUsed: { increment: 1 } },
      });

      return { 
        success: true, 
        discountType: validation.discountType,
        discountValue: validation.discountValue
      };
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      return { success: false, error: "Failed to redeem code" };
    }
  }

  async generateCode(
    code: string,
    options?: {
      maxUses?: number;
      expiresAt?: Date;
      discountType?: string;
      discountValue?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.prisma.promoCode.create({
        data: {
          code: code.toUpperCase(),
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
      console.error("Error generating promo code:", error);
      
      if (error.code === "P2002") {
        return { success: false, error: "This promo code already exists" };
      }
      
      return { success: false, error: "Failed to generate code" };
    }
  }
}