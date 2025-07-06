/**
 * Provider enum that matches database provider names
 */
export enum Provider {
  YOUTUBE = "youtube",
  REDDIT = "reddit",
}

/**
 * Interface for parsed URL result
 */
export interface ParsedUrl {
  /** The provider type (e.g., 'youtube', 'reddit') */
  provider: Provider;
  /** The normalized URL without tracking parameters */
  url: string;
  /** Extracted metadata like timestamps, playlists, etc. */
  metadata?: Record<string, any>;
}

/**
 * Interface for the complete parse result
 */
export interface ParseResult {
  /** The detected provider */
  provider: Provider;
  /** The normalized URL */
  url: string;
  /** Any extracted metadata */
  metadata?: {
    /** Original tracking parameters that were removed */
    trackingParams?: Record<string, string>;
    /** Video timestamp if present */
    timestamp?: string;
    /** Playlist ID if present */
    playlistId?: string;
    /** Any other metadata extracted from the URL */
    [key: string]: any;
  };
}

/**
 * Configuration options for URL parsing
 */
export interface UrlParserConfig {
  /** Maximum allowed URL length */
  maxUrlLength?: number;
  /** Whether to allow localhost URLs for testing */
  allowLocalhost?: boolean;
  /** Whether to extract metadata from URLs */
  extractMetadata?: boolean;
}
