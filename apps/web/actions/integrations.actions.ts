"use server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";

import { Integration } from "@repo/db";
import {
  integrationsService,
  providerService,
  youtubeService,
  redditService,
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

  // Handle Reddit token revocation
  if (provider && provider.name === "reddit") {
    await redditService.revokeIntegration(integration.accessToken);
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
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session or another secure way if needed
    // For now, we'll use a simple random string
    
    const authUrl = redditService.generateAuthUrl(state);
    redirect(authUrl);
  }
};

export async function shouldShowOnboarding(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const integrations = await integrationsService.getUserIntegrations(session.user.id);
    
    // Show onboarding if user has no integrations
    return integrations.length === 0;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
