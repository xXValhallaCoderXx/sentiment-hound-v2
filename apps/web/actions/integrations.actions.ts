"use server";
import { auth } from "@/lib/next-auth.lib";
import { prisma } from "@repo/db";
import {
  CoreIntegrationService,
  IntegrationRepository,
  ProviderRepository,
  CoreProviderService,
  IIntegration,
} from "@repo/services";

const integrationRepository = new IntegrationRepository(prisma);
const integrationService = new CoreIntegrationService(integrationRepository);

const providerRepository = new ProviderRepository(prisma);
const providerService = new CoreProviderService(providerRepository);

interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

export async function getUserIntegrations(
  id: string
): Promise<ActionResponse<IIntegration[]>> {
  try {
    const data = await integrationService.getUserIntegrations(id);
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
): Promise<ActionResponse<IIntegration>> {
  try {
    const data = await integrationService.getIntegration(id);
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

export async function getAllIntegrations(): Promise<
  ActionResponse<IIntegration[]>
> {
  try {
    const data = await integrationService.getAllIntegrations();
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

export async function createIntegration(
  userId: string,
  accountId: string,
  providerId: number,
  accessToken: string,
  refreshToken: string
): Promise<ActionResponse<IIntegration>> {
  try {
    const data = await integrationService.createIntegration(
      userId,
      accountId,
      providerId,
      accessToken,
      refreshToken
    );
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

export const integrateProvider = async (formData: FormData) => {
  console.log("LETS GO");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  if (!formData.get("providerId")) {
    throw new Error("Provider not found");
  }
  const rawFormData = {
    providerId: formData.get("providerId"),
  };
  // const provider = await providerService.getProvider(
  //   rawFormData.providerId
  // );

  // console.log("PROVIDER", provider);
  // if (provider && provider.name === "youtube") {
  //   const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  //   const redirectUri = `${baseUrl}/api/auth/youtube/callback`;
  //   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;
  //   redirect(authUrl);
  // }
};