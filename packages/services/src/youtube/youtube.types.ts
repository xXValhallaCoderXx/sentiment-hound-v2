/**
 * Type definitions for YouTube API authentication and configuration
 */

/**
 * Enumeration of supported authentication methods for YouTube API access
 */
export enum AuthenticationMethod {
  /** OAuth 2.0 token-based authentication (user-specific tokens) */
  OAUTH = 'oauth',
  /** API key-based authentication (application-level access) */
  API_KEY = 'api_key'
}

/**
 * Configuration interface for YouTube API authentication
 */
export interface YoutubeAuthConfig {
  /** The authentication method being used */
  method: AuthenticationMethod;
  /** The authentication token (OAuth token or API key) */
  token: string;
  /** Optional HTTP headers to include in requests (used for OAuth) */
  headers?: Record<string, string>;
}
