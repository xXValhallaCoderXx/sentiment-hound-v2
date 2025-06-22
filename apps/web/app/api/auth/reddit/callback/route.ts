/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import {
  redditService,
  providerService,
  integrationsService,
} from "@repo/services";

export async function GET(req: NextRequest) {
  const code = req?.nextUrl.searchParams.get("code");
  const error = req?.nextUrl.searchParams.get("error");

  if (error) {
    console.error("Reddit OAuth error:", error);
    const baseUrl = req.nextUrl.origin;
    const failureUrl = new URL(
      "/dashboard/integrations?success=false&error=oauth_denied",
      baseUrl
    );
    return NextResponse.redirect(failureUrl);
  }

  if (!code) {
    const baseUrl = req.nextUrl.origin;
    const failureUrl = new URL(
      "/dashboard/integrations?success=false&error=no_code",
      baseUrl
    );
    return NextResponse.redirect(failureUrl);
  }

  const session = await auth();
  const baseUrl = req.nextUrl.origin;

  if (session?.user) {
    try {
      const userId = session.user.id as string;
      const integration = await redditService.connectRedditIntegration(code);

      const redditProvider = await providerService.getProviderByName("reddit");

      if (!redditProvider) {
        throw new Error("Reddit provider not found");
      }

      await integrationsService.createIntegration({
        providerId: redditProvider.id,
        accessToken: integration.accessToken,
        refreshToken: integration.refreshToken || "",
        accountId: integration.accountId,
        userId,
        refreshTokenExpiresAt: new Date(
          Date.now() + integration.expiresIn * 1000
        ),
      });

      // Construct success URL
      const successUrl = new URL(
        "/dashboard/integrations?success=true",
        baseUrl
      );
      return NextResponse.redirect(successUrl);
    } catch (error: any) {
      console.error("Failed to create Reddit integration:", error);

      // Handle plan limit errors gracefully
      const errorMessage = error.message?.includes("Plan limit")
        ? "plan_limit_exceeded"
        : "integration_failed";

      // Construct failure URL
      const failureUrl = new URL(
        `/dashboard/integrations?success=false&error=${errorMessage}`,
        baseUrl
      );
      return NextResponse.redirect(failureUrl);
    }
  } else {
    // Construct failure URL
    const failureUrl = new URL(
      "/dashboard/integrations?success=false&error=no_session",
      baseUrl
    );
    return NextResponse.redirect(failureUrl);
  }
}
