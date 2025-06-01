"use server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";

import { Integration } from "@repo/db";
import {
  integrationsService,
  providerService,
  youtubeService,
} from "@repo/services";

export async function getUserIntegrations(): Promise<
  ActionResponse<Integration[]>
> {
  try {
    const data = await integrationsService.getAllIntegrations();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getIntegration(
  id: number
): Promise<ActionResponse<Integration>> {
  try {
    const data = await integrationsService.getIntegration(id);
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function getAllIntegrations(): Promise<
  ActionResponse<Integration[]>
> {
  try {
    const data = await integrationsService.getAllIntegrations();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function revokeIntegration(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  const providerId = formData.get("providerId");
  if (!providerId) {
    throw new Error("Provider not found");
  }

  const integration =
    await integrationsService.getIntegrationUserIntegrationByProviderId(
      Number(providerId),
      String(userId)
    );
  if (!integration) {
    throw new Error("Integration not found");
  }

  const provider = await providerService.getProvider(
    integration.providerId.toString()
  );

  // Handle YouTube token revocation
  if (provider && provider.name === "youtube") {
    await youtubeService.revokeRefreshToken(integration.refreshToken);
  }

  // // Delete the integration from our database
  await integrationsService.deleteIntegration(integration.id);
  redirect("/dashboard/integrations");
}

export const integrateProvider = async (formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const providerId = formData.get("providerId");
  if (!providerId) {
    throw new Error("Provider not found");
  }

  const provider = await providerService.getProvider(providerId as string);

  if (provider && provider.name === "youtube") {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/youtube/callback`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;
    redirect(authUrl);
  }

  if (provider && provider.name === "reddit") {
    console.log("Reddit integration not implemented yet");
    const result = await integrationsService.createIntegration({
      userId,
      accessToken: "N/A",
      accountId: "N/A",
      providerId: Number(providerId),
      refreshToken: "N/A",
      refreshTokenExpiresAt: new Date(),
    });

    if (result) {
      console.log("Integration created successfully:", result);
    } else {
      console.error("Failed to create integration for Reddit");
    }
    redirect("/dashboard/integrations");
  }
};
