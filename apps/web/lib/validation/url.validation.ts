/**
 * Client-side URL validation utilities for the analyse form
 * Pure client-side implementation without server dependencies
 */

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  provider?: string;
}

/**
 * Client-side URL patterns for basic validation
 * Note: Server-side validation will be more comprehensive
 */
const URL_PATTERNS = {
  youtube: {
    // Standard youtube.com/watch?v={id} format
    standard:
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    // Mobile m.youtube.com/watch?v={id} format
    mobile: /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    // Short youtu.be/{id} format
    short: /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embedded youtube.com/embed/{id} format
    embed: /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  },
  reddit: {
    // Reddit post patterns (basic client-side validation)
    post: /^https?:\/\/(?:www\.)?reddit\.com\/r\/[^/]+\/comments\/[^/]+/,
    shortLink: /^https?:\/\/redd\.it\/[a-zA-Z0-9]+/,
  },
};

/**
 * Validates a URL for analysis submission (client-side basic validation)
 * @param url The URL to validate
 * @returns Validation result with error message if invalid
 */
export function validateUrl(url: string): UrlValidationResult {
  // Basic checks first
  if (!url || typeof url !== "string") {
    return {
      isValid: false,
      error: "Please enter a URL",
    };
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return {
      isValid: false,
      error: "Please enter a URL",
    };
  }

  // Basic URL format check
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return {
      isValid: false,
      error: "URL must start with http:// or https://",
    };
  }

  // Basic URL object validation
  try {
    new URL(trimmedUrl);
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid URL",
    };
  }

  // Check for supported providers using basic patterns
  const provider = detectProvider(trimmedUrl);
  if (!provider) {
    return {
      isValid: false,
      error:
        "This platform is not yet supported. Currently supporting YouTube.",
    };
  }

  return {
    isValid: true,
    provider: provider,
  };
}

/**
 * Detect provider from URL using client-side patterns
 * @param url The URL to analyze
 * @returns Provider name or null if unsupported
 */
function detectProvider(url: string): string | null {
  // Check YouTube patterns
  for (const pattern of Object.values(URL_PATTERNS.youtube)) {
    if (pattern.test(url)) {
      return "youtube";
    }
  }

  // Check Reddit patterns
  for (const pattern of Object.values(URL_PATTERNS.reddit)) {
    if (pattern.test(url)) {
      return "reddit";
    }
  }

  return null;
}

/**
 * Basic URL validation for development/testing
 * @param url The URL to validate
 * @returns Whether the URL is basically valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract YouTube video ID from URL (client-side)
 * @param url YouTube URL
 * @returns Video ID or null
 */
export function extractYouTubeVideoId(url: string): string | null {
  for (const pattern of Object.values(URL_PATTERNS.youtube)) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Checks if a URL is a valid YouTube URL
 * @param url The URL to check
 * @returns True if it's a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  const result = validateUrl(url);
  return result.isValid && result.provider === "youtube";
}

/**
 * Checks if a URL is a valid Reddit URL
 * @param url The URL to check
 * @returns True if it's a valid Reddit URL
 */
export function isValidRedditUrl(url: string): boolean {
  const result = validateUrl(url);
  return result.isValid && result.provider === "reddit";
}

/**
 * Gets user-friendly error message for common URL validation failures
 * @param url The URL that failed validation
 * @returns User-friendly error message
 */
export function getUrlValidationErrorMessage(url: string): string {
  const result = validateUrl(url);
  return result.error || "Invalid URL";
}

/**
 * Validates URL and provides specific feedback for different error types
 * @param url The URL to validate
 * @returns Detailed validation result with specific error types
 */
export function validateUrlWithDetails(url: string): UrlValidationResult & {
  errorType?: "empty" | "malformed" | "unsupported" | "invalid";
} {
  const baseResult = validateUrl(url);

  if (baseResult.isValid) {
    return baseResult;
  }

  // Determine error type for more specific handling
  if (!url || !url.trim()) {
    return {
      ...baseResult,
      errorType: "empty",
    };
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return {
      ...baseResult,
      errorType: "malformed",
    };
  }

  // Try to parse to determine if it's unsupported vs invalid
  try {
    new URL(url);
    return {
      ...baseResult,
      errorType: "unsupported",
    };
  } catch {
    return {
      ...baseResult,
      errorType: "invalid",
    };
  }
}
