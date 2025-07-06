import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { invitationTokenService } from "@repo/services";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invitationToken } = await req.json();
    
    if (!invitationToken) {
      return NextResponse.json({ error: "Invitation token is required" }, { status: 400 });
    }

    // Check if user already has a plan assigned by invitation token
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

    // Consume the token and update user plan
    const result = await invitationTokenService.consumeInvitationToken(invitationToken, session.user.id);
    
    if (!result.isValid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Update user with new plan
    if (result.planId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { planId: result.planId }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Invitation token applied successfully" 
    });

  } catch (error) {
    console.error("Error applying invitation token:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}