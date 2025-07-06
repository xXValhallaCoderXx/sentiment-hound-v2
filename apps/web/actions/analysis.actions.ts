"use server";

import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";
import {
  taskService,
  integrationsService,
  urlParserService,
} from "@repo/services";
import { TaskType } from "@repo/db";

/**
 * Initiates sentiment analysis for a social media post with intelligent token fallback logic.
 *
 * This server action detects the provider from the URL, selects the appropriate authentication
 * token (user integration or master token fallback), and creates analysis tasks in the database.
 *
 * @param postUrl - The URL of the social media post to analyze (YouTube, Reddit, etc.)
 * @returns Promise resolving to ActionResponse with task ID and status, or error details
 */
export async function startAnalysis(
  postUrl: string
): Promise<ActionResponse<{ taskId: number; status: string }>> {
  try {
    // Get current session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        data: null,
        error: createErrorResponse({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
          statusCode: 401,
        }),
      };
    }

    // Provider detection and URL processing
    let provider: string;
    let normalizedUrl: string;

    try {
      // Parse URL to detect provider and normalize
      const parseResult = urlParserService.parse(postUrl);
      provider = parseResult.provider;
      normalizedUrl = parseResult.url;

      console.log(
        `URL parsed successfully: provider=${provider}, normalizedUrl=${normalizedUrl}`
      );
    } catch (urlError) {
      return {
        data: null,
        error: createErrorResponse({
          message: "Unsupported or invalid URL",
          code: "URL_INVALID",
          statusCode: 400,
        }),
      };
    }

    // Token selection logic
    let tokenToUse: string;

    try {
      // Check for user integration
      const userIntegration =
        await integrationsService.getUserIntegrationByName(userId, provider);

      console.log(
        `Integration lookup for user ${userId}, provider ${provider}: ${userIntegration ? "found" : "not found"}`
      );

      // Validate integration exists and is active
      if (userIntegration && userIntegration.isActive) {
        tokenToUse = userIntegration.accessToken;
        console.log(
          `Token selection: user integration token selected for provider: ${provider}`
        );
      } else {
        if (userIntegration && !userIntegration.isActive) {
          console.log(
            `User integration found but inactive for provider: ${provider}, falling back to master token`
          );
        }

        // Fallback to master token
        const masterTokenKey = `${provider.toUpperCase()}_MASTER_ACCESS_TOKEN`;
        const masterToken = process.env[masterTokenKey];

        if (masterToken) {
          tokenToUse = masterToken;
          console.log(
            `Token selection: master token selected for provider: ${provider}`
          );
        } else {
          console.error(`No master token available for provider: ${provider}`);
          throw new Error(`No token available for provider: ${provider}`);
        }
      }

      // Task creation
      try {
        const task = await taskService.createTask({
          integrationId: userIntegration?.id || 0, // Use user integration ID if available, otherwise 0 for master token
          taskType: TaskType.ANALYZE_POST,
          userId,
          extraData: {
            url: normalizedUrl,
            token: tokenToUse,
          },
        });

        return {
          data: {
            taskId: task.id,
            status: "PENDING",
          },
          error: null,
        };
      } catch (dbError) {
        return {
          data: null,
          error: createErrorResponse({
            message: "Failed to create analysis task. Please try again.",
            code: "DATABASE_ERROR",
            statusCode: 500,
          }),
        };
      }
    } catch (tokenError) {
      // Handle specific error types
      if (
        tokenError instanceof Error &&
        tokenError.message === "INTEGRATION_INACTIVE"
      ) {
        return {
          data: null,
          error: createErrorResponse({
            message: "Integration is inactive. Please reconnect your account.",
            code: "INTEGRATION_INACTIVE",
            statusCode: 400,
          }),
        };
      }

      return {
        data: null,
        error: createErrorResponse({
          message: "Analysis for this provider is not available at this time",
          code: "AUTH_UNAVAILABLE",
          statusCode: 503,
        }),
      };
    }
    // Remove this entire unreachable return statement
  } catch (error) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}
