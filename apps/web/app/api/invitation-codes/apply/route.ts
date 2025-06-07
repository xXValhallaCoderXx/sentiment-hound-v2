import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { invitationCodeService } from "@repo/services";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invitationCode } = await req.json();
    
    if (!invitationCode) {
      return NextResponse.json({ error: "Invitation code is required" }, { status: 400 });
    }

    // Validate the code
    const validation = await invitationCodeService.validateCode(invitationCode);
    
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if user already has a plan assigned by invitation code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { plan: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow upgrading from trial plan
    if (user.plan && user.plan.name !== "trial") {
      return NextResponse.json({ 
        error: "You already have an active plan" 
      }, { status: 400 });
    }

    // Redeem the code and update user plan
    const redemption = await invitationCodeService.redeemCode(invitationCode);
    
    if (!redemption.success) {
      return NextResponse.json({ error: redemption.error }, { status: 400 });
    }

    // Update user with new plan
    if (redemption.planId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { planId: redemption.planId }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Invitation code applied successfully" 
    });

  } catch (error) {
    console.error("Error applying invitation code:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}