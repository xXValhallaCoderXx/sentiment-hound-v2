import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";

export async function POST() {
  // const session = await auth();
  // const userId = session?.user?.id as string;
  // const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return NextResponse.json({ success: true });
}
