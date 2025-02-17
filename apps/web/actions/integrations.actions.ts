"use server";

import { prisma } from "@repo/db";
import {
  CoreIntegrationService,
  IntegrationRepository,
  IIntegration,
} from "@repo/services";

const integrationRepository = new IntegrationRepository(prisma);
const integrationService = new CoreIntegrationService(integrationRepository);

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
