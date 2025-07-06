/**
 * ExecutionContext Builder Implementation
 * 
 * This module provides the core logic for building execution contexts for job processors,
 * handling authentication token management, user integration lookup, and fallback strategies.
 */

import { ExecutionContext, TokenSource } from './execution-context.interface';
import { subtaskService, youtubeService, integrationsService } from '../index';
import { IntegrationAuthenticationError } from '../integrations/integrations.errors';

/**
 * Builds a complete ExecutionContext for job processing operations.
 * 
 * This function implements the unified authentication strategy:
 * 1. Fetch comprehensive job data including user, provider, and integration info
 * 2. Check if user has a valid OAuth integration for the provider
 * 3. Validate and refresh OAuth tokens if necessary
 * 4. Fall back to master API key if user authentication fails
 * 5. Throw error if no authentication method is available
 * 
 * @param jobId - The job/subtask ID to build context for
 * @param jobData - The job payload data containing operation parameters
 * @returns Promise resolving to a fully populated ExecutionContext
 * @throws IntegrationAuthenticationError when no valid authentication method is found
 */
export async function buildExecutionContext(
  jobId: number,
  jobData: any
): Promise<ExecutionContext> {
  try {
    // Step 1: Fetch comprehensive data for the job
    const taskWithProvider = await subtaskService.getTaskWithProviderForSubTask(jobId);
    
    const { task } = taskWithProvider;
    const { user, provider } = task;
    
    // Step 2: Try to get user's integration for this provider
    let userIntegration = null;
    try {
      userIntegration = await integrationsService.getIntegrationUserIntegrationByProviderId(
        provider.id,
        user.id.toString()
      );
    } catch (error) {
      // No user integration found - will fall back to master token
      console.log(`No user integration found for user ${user.id} and provider ${provider.id}`);
    }

    // Step 3: If user has integration, validate and refresh token if needed
    if (userIntegration) {
      const now = new Date();
      const tokenExpiry = new Date(userIntegration.refreshTokenExpiresAt);
      
      // Check if token is expired and needs refresh
      if (tokenExpiry <= now && userIntegration.refreshToken) {
        try {
          console.log(`Refreshing expired OAuth token for user ${user.id}`);
          
          // Attempt to refresh the access token using the refresh token
          const refreshedToken = await youtubeService.refreshAccessToken(
            userIntegration.refreshToken
          );
          
          // Persist the new credentials to the database
          const updatedIntegration = await integrationsService.updateIntegrationAuthCredentials({
            providerId: provider.id,
            userId: user.id.toString(),
            accessToken: refreshedToken.accessToken,
            refreshToken: refreshedToken.refreshToken || userIntegration.refreshToken,
            accessTokenExpiry: new Date(Date.now() + refreshedToken.expiresIn * 1000),
          });
          
          // Return context with refreshed OAuth token
          return {
            userId: Number(user.id),
            providerId: provider.id,
            providerName: provider.name,
            authToken: refreshedToken.accessToken,
            jobData,
            integrationId: updatedIntegration.id,
            tokenSource: TokenSource.USER_OAUTH,
            authMethod: 'OAUTH',
          };
        } catch (refreshError) {
          console.error(`Failed to refresh OAuth token for user ${user.id}:`, refreshError);
          // Continue to master token fallback if refresh fails
        }
      } else if (userIntegration.accessToken && tokenExpiry > now) {
        // Token is still valid, use it directly without refresh
        return {
          userId: Number(user.id),
          providerId: provider.id,
          providerName: provider.name,
          authToken: userIntegration.accessToken,
          jobData,
          integrationId: userIntegration.id,
          tokenSource: TokenSource.USER_OAUTH,
          authMethod: 'OAUTH',
        };
      }
    }

    // Step 4: Fall back to master API key as last resort
    const masterToken = process.env.YOUTUBE_MASTER_API_KEY;
    if (!masterToken) {
      throw new IntegrationAuthenticationError(
        `No valid authentication method available for job ${jobId}. ` +
        `User has no valid OAuth integration and no master API key is configured.`
      );
    }

    console.log(`Using master API key for job ${jobId} (user ${user.id}, provider ${provider.name})`);
    
    // Return context with master API key (no integrationId since it's not user-specific)
    return {
      userId: Number(user.id),
      providerId: provider.id,
      providerName: provider.name,
      authToken: masterToken,
      jobData,
      integrationId: null, // Master token is not tied to a specific integration
      tokenSource: TokenSource.MASTER_API_KEY,
      authMethod: 'API_KEY',
    };

  } catch (error) {
    if (error instanceof IntegrationAuthenticationError) {
      throw error;
    }
    
    // Wrap other errors in authentication error for consistent handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new IntegrationAuthenticationError(
      `Failed to build execution context for job ${jobId}: ${errorMessage}`
    );
  }
}
