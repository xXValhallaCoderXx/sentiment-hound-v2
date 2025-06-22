import { NextResponse } from "next/server";

export async function POST() {
  // const session = await auth();
  // const userId = session?.user?.id as string;
  // const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return NextResponse.json({ success: true });
}
