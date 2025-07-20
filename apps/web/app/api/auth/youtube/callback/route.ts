/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import {
  youtubeService,
  providerService,
  integrationsService,
} from "@repo/services";

export async function GET(req: NextRequest) {
  const code = req?.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.error();
  }
  const session = await auth();
  const baseUrl = req.nextUrl.origin; // Get the base URL

  if (session?.user) {
    const userId = session.user.id as string;
    const integration = await youtubeService.connectYoutubeIntegration(code);

    const youtube = await providerService.getProviderByName("youtube");

    if (!youtube) {
      throw new Error("YouTube provider not found");
    }

    try {
      await integrationsService.createIntegration({
        providerId: youtube.id,
        accessToken: integration.accessToken,
        refreshToken: integration.refreshToken,
        accountId: integration.youtubeAccountId,
        userId,
        refreshTokenExpiresAt: integration.refreshTokenExpiresAt,
      });

      // Construct absolute URL
      const successUrl = new URL(
        "/dashboard/integrations?success=true",
        baseUrl,
      );
      return NextResponse.redirect(successUrl);
    } catch (error: any) {
      // Handle plan limit errors gracefully
      const errorMessage = error.message?.includes("Plan limit")
        ? "plan_limit_exceeded"
        : "integration_failed";

      const failureUrl = new URL(
        `/dashboard/integrations?success=false&error=${errorMessage}`,
        baseUrl,
      );
      return NextResponse.redirect(failureUrl);
    }
  } else {
    // Construct absolute URL
    const failureUrl = new URL(
      "/dashboard/integrations?success=false",
      baseUrl,
    );
    return NextResponse.redirect(failureUrl);
  }
}
