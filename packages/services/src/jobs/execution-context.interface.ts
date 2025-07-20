/**
 * Execution Context for Job Processors
 *
 * This module defines the unified execution context pattern for job processors,
 * providing a standardized way to handle authentication, job data, and provider
 * information across all job processing operations.
 */

/**
 * Enum defining the source of the authentication token
 */
export enum TokenSource {
  /** User OAuth token from their connected integration */
  USER_OAUTH = "USER_OAUTH",
  /** Master API key from environment variables */
  MASTER_API_KEY = "MASTER_API_KEY",
}

/**
 * Core execution context interface that encapsulates all necessary data
 * for executing a job processor operation with proper authentication.
 *
 * This interface follows immutability principles and should be treated
 * as a read-only data structure once created.
 */
export interface ExecutionContext {
  /**
   * The ID of the user who owns this job/task (CUID string)
   * Used for data association and permission checks
   */
  readonly userId: string;

  /**
   * The ID of the provider (e.g., YouTube, Twitter)
   * References the provider database record
   */
  readonly providerId: number;

  /**
   * Human-readable name of the provider (e.g., 'youtube', 'twitter')
   * Used for routing logic and provider-specific processing
   */
  readonly providerName: string;

  /**
   * The authentication token to use for API calls
   * Can be either a user OAuth token or a master API key
   */
  readonly authToken: string;

  /**
   * The raw job data payload containing operation-specific parameters
   * Structure varies based on job type and provider
   */
  readonly jobData: any;

  /**
   * The integration ID linking user to provider
   * Null when using master API key authentication
   */
  readonly integrationId: number | null;

  /**
   * Indicates the source/type of the authentication token
   * Used for proper API request configuration
   */
  readonly tokenSource: TokenSource;

  /**
   * Explicit authentication method for API requests
   * Eliminates heuristic-based detection and ensures deterministic behavior
   */
  readonly authMethod: "OAUTH" | "API_KEY";
}

/**
 * Type definition for the ExecutionContext builder function
 *
 * @param jobId - The job ID to build context for
 * @param jobData - The job payload data
 * @returns Promise resolving to a fully populated ExecutionContext
 * @throws IntegrationAuthenticationError when no valid authentication method is available
 */
export type ExecutionContextBuilder = (
  jobId: number,
  jobData: any,
) => Promise<ExecutionContext>;
