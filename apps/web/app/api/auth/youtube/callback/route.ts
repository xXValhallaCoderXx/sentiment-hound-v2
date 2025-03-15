import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { youtubeService } from "@repo/services";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req?.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.error();
  }
  const session = await auth();

  if (session?.user) {
    const userId = session?.user?.id;
    await youtubeService.connectYoutubeIntegration(code, userId as string);
    redirect("/dashboard/integrations?success=true");
  } else {
    redirect("/dashboard/integrations?success=false");
  }
}
