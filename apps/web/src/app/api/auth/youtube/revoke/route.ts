import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/next-auth.lib";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  const userId = session?.user?.id as string;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  console.log("USER ID", userId);

  return Response.json({ hi: "" });
}
