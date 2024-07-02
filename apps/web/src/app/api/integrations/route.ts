import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth();
  console.log(session);
  return NextResponse.json({ ok: "" });
};
