"use server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";

import { Integration } from "@repo/db";
import { integrationsService, providerService } from "@repo/services";

interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

export async function getUserIntegrations(): Promise<ActionResponse<Integration[]>> {
  try {
    const data = await integrationsService.getAllIntegrations();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
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
      error: {
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
    };
  }
}

export async function getAllIntegrations(): Promise<ActionResponse<Integration[]>> {
  try {
    const data = await integrationsService.getAllIntegrations();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: {
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
    };
  }
}

export async function revokeIntegration(formData: FormData) {
  console.log("LETS GO: ", formData);
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
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${integration.accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("REVOKE TOKEN: ", response);
    if (!response.ok) {
      console.error("Failed to revoke Google token");
    }
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
};

