import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import {
  youtubeService,
  providerService,
  integrationsService,
} from "@repo/services";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req?.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.error();
  }
  const session = await auth();

  if (session?.user) {
    const userId = session.user.id as string;
    const integration = await youtubeService.connectYoutubeIntegration(code);

    const youtube = await providerService.getProviderByName("youtube");

    if (!youtube) {
      throw new Error("YouTube provider not found");
    }

    await integrationsService.createIntegration({
      providerId: youtube.id,
      accessToken: integration.accessToken,
      refreshToken: integration.refreshToken,
      accountId: integration.youtubeAccountId,
      userId,
      refreshTokenExpiresAt: integration.refreshTokenExpiresAt,
    });

    redirect("/dashboard/integrations?success=true");
  } else {
    redirect("/dashboard/integrations?success=false");
  }
}
