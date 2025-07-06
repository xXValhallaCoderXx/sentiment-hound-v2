/**
 * Base error class for URL parsing errors
 */
export abstract class UrlParserError extends Error {
  public readonly code: string;
  public readonly url?: string;

  constructor(message: string, code: string, url?: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.url = url;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when a URL is invalid or malformed
 */
export class InvalidUrlError extends UrlParserError {
  constructor(message: string, url?: string) {
    super(message, "INVALID_URL", url);
  }

  static create(url: string, reason?: string): InvalidUrlError {
    const baseMessage = `Invalid URL format: ${url}`;
    const fullMessage = reason ? `${baseMessage}. ${reason}` : baseMessage;
    return new InvalidUrlError(fullMessage, url);
  }

  static malformed(url: string): InvalidUrlError {
    return new InvalidUrlError(
      `Malformed URL: ${url}. Please provide a valid URL with proper format (https://example.com).`,
      url
    );
  }

  static tooLong(url: string, maxLength: number): InvalidUrlError {
    return new InvalidUrlError(
      `URL exceeds maximum length of ${maxLength} characters: ${url.substring(0, 100)}...`,
      url
    );
  }

  static invalidProtocol(url: string): InvalidUrlError {
    return new InvalidUrlError(
      `Invalid protocol. Only HTTP and HTTPS URLs are supported: ${url}`,
      url
    );
  }
}

/**
 * Error thrown when a URL is from an unsupported provider
 */
export class UnsupportedProviderError extends UrlParserError {
  public readonly domain: string;

  constructor(message: string, domain: string, url?: string) {
    super(message, "UNSUPPORTED_PROVIDER", url);
    this.domain = domain;
  }

  static create(url: string, domain: string): UnsupportedProviderError {
    return new UnsupportedProviderError(
      `Unsupported provider domain: ${domain}. Currently supported providers: YouTube. URL: ${url}`,
      domain,
      url
    );
  }

  static notSupported(url: string): UnsupportedProviderError {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      return UnsupportedProviderError.create(url, domain);
    } catch {
      return new UnsupportedProviderError(
        `Unable to determine provider from URL: ${url}`,
        "unknown",
        url
      );
    }
  }
}
