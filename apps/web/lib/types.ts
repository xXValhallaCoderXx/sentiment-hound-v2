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
  error: any,
  defaultMessage = "Unknown error occurred"
): ErrorResponse {
  return {
    error: error.message || defaultMessage,
    code: error.code || "UNKNOWN_ERROR",
    status: error.statusCode || 500,
  };
}
