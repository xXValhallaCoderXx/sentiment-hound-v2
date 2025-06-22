/**
 * Shared types for the web application
 */

export interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

export type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

/**
 * Helper function to create error responses
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage = "Unknown error occurred"
): ErrorResponse {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  const errorCode = (error as { code?: string })?.code || "UNKNOWN_ERROR";
  const statusCode = (error as { statusCode?: number })?.statusCode || 500;
  // You might want to add more specific error handling here
  // for custom error types that have 'code' or 'statusCode' properties.

  return {
    error: errorMessage,
    code: errorCode,
    status: statusCode,
  };
}
