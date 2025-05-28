import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/next-auth.lib";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();

  return NextResponse.json({ ok: "" });
};
