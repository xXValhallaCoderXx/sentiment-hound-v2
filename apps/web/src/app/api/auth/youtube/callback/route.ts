import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { prisma } from "database";
import { youtubeService, providersService } from "services";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req?.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.error();
  }

  const { accessToken, refreshToken, expiresIn } =
    await youtubeService.generateAuthFromCode(code);

  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  const userInfo = await youtubeService.getUserProfile(accessToken);
  const youtubeAccountId = userInfo?.id;

  const session = await auth();
  if (session?.user) {
    const userId = session?.user.id;

    const youtubeProvider = await providersService.getProviderByName("youtube");

    if (youtubeProvider) {
      await prisma.integration.create({
        data: {
          provider: {
            connect: {
              id: youtubeProvider.id,
            },
          },
          accountId: youtubeAccountId,
          accessToken,
          refreshToken,
          refreshTokenExpiresAt: expiresAt,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    redirect("/dashboard/integrations?success=true");
  }

  // Get the current session to associate the YouTube account with the logged-in user

  redirect("/dashboard/integrations?success=false");
}
