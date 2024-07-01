import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { prisma } from "database";

import { getSession } from "next-auth/react";

export async function GET(req: NextRequest, res: NextResponse) {
  const code = req?.nextUrl.searchParams.get("code");
  console.log("code", code);
  if (!code) {
    return Response.error();
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id: process.env.AUTH_GOOGLE_ID,
      client_secret: process.env.AUTH_GOOGLE_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const token = await tokenResponse.json();
  console.log("token", token);
  const accessToken = token.access_token;
  const refreshToken = token.refresh_token;
  const idToken = token.id_token;

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userInfo = await userInfoResponse.json();

  const youtubeAccountId = userInfo?.id;
  const youtubeAccountName = userInfo?.name;

  const session = await auth();
  if (session?.user) {
    const userId = session?.user.id;

    await prisma.socialAccount.create({
      data: {
        provider: "YOUTUBE",
        accountId: youtubeAccountId,
        accessToken,
        refreshToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    redirect("/app/integrations?success=true");
  }

  // Get the current session to associate the YouTube account with the logged-in user

  redirect("/app/integrations?success=false");
}
