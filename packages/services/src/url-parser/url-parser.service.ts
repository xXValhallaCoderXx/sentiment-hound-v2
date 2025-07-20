import { Provider, ParseResult, UrlParserConfig } from "./url-parser.types";
import { InvalidUrlError, UnsupportedProviderError } from "./url-parser.errors";

/**
 * Service for parsing URLs to determine provider and normalize format
 */
export class UrlParserService {
  private readonly config: Required<UrlParserConfig>;

  // YouTube URL patterns for various formats
  private readonly youtubePatterns = {
    // Standard youtube.com/watch?v={id} format
    standard:
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Mobile m.youtube.com/watch?v={id} format
    mobile:
      /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    // Short youtu.be/{id} format
    short: /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
    // Embedded youtube.com/embed/{id} format
    embed:
      /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
  };

  constructor(config: UrlParserConfig = {}) {
    this.config = {
      maxUrlLength: config.maxUrlLength ?? 2048,
      allowLocalhost: config.allowLocalhost ?? true,
      extractMetadata: config.extractMetadata ?? true,
    };
  }

  /**
   * Parse a URL to determine provider and normalize format
   * @param url The URL to parse
   * @returns ParseResult with provider, normalized URL, and metadata
   * @throws InvalidUrlError for malformed URLs
   * @throws UnsupportedProviderError for unsupported domains
   */
  public parse(url: string): ParseResult {
    // Step 1: Basic validation
    this.validateUrl(url);
    this.validateUrlLength(url);
    this.validateProtocol(url);
    this.validateDomain(url);

    // Step 2: Extract tracking parameters first
    const { cleanUrl, trackingParams } = this.extractTrackingParameters(url);

    // Step 3: Detect provider
    const provider = this.detectProvider(cleanUrl);

    // Step 4: Normalize URL
    const normalizedUrl = this.normalizeUrl(cleanUrl, provider);

    // Step 5: Extract metadata
    const urlMetadata = this.extractMetadata(cleanUrl, provider);

    // Step 6: Combine all metadata
    let metadata: ParseResult["metadata"] = undefined;

    if (this.config.extractMetadata) {
      metadata = {
        ...urlMetadata,
        trackingParams:
          Object.keys(trackingParams).length > 0 ? trackingParams : undefined,
      };

      // Only include metadata if there's actual data
      const hasMetadata = Object.values(metadata).some(
        (value) => value !== undefined,
      );
      if (!hasMetadata) {
        metadata = undefined;
      }
    }

    return {
      provider,
      url: normalizedUrl,
      metadata,
    };
  }

  /**
   * Validate URL format and structure
   * @param url The URL to validate
   * @throws InvalidUrlError if URL is invalid
   */
  private validateUrl(url: string): void {
    if (!url || typeof url !== "string") {
      throw new InvalidUrlError("URL must be a non-empty string");
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      throw new InvalidUrlError("URL cannot be empty or whitespace only");
    }

    try {
      new URL(trimmedUrl);
    } catch (error) {
      throw new InvalidUrlError(
        `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Validate URL length
   * @param url The URL to check
   * @throws InvalidUrlError if URL exceeds maximum length
   */
  private validateUrlLength(url: string): void {
    if (url.length > this.config.maxUrlLength) {
      throw new InvalidUrlError(
        `URL length ${url.length} exceeds maximum allowed length of ${this.config.maxUrlLength}`,
      );
    }
  }

  /**
   * Validate domain is from supported provider
   * @param url The URL to check
   * @throws UnsupportedProviderError if domain is not supported
   */
  private validateDomain(url: string): void {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Define supported domains
    const supportedDomains = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "music.youtube.com",
    ];

    // Check for localhost if allowed
    if (
      this.config.allowLocalhost &&
      (hostname === "localhost" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("192.168."))
    ) {
      return;
    }

    const isSupported = supportedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    if (!isSupported) {
      throw new UnsupportedProviderError(
        `Unsupported domain: ${hostname}. Supported domains: ${supportedDomains.join(", ")}`,
        hostname,
        url,
      );
    }
  }

  /**
   * Validate protocol (http/https)
   * @param url The URL to check
   * @throws InvalidUrlError if protocol is not supported
   */
  private validateProtocol(url: string): void {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.toLowerCase();

    if (protocol !== "http:" && protocol !== "https:") {
      throw new InvalidUrlError(
        `Invalid protocol '${protocol}'. Only HTTP and HTTPS protocols are supported`,
        url,
      );
    }
  }

  /**
   * Extract YouTube video ID from URL using regex patterns
   * @param url The YouTube URL to extract video ID from
   * @returns The extracted video ID or null if not found
   */
  private extractYouTubeVideoId(url: string): string | null {
    for (const [patternName, pattern] of Object.entries(this.youtubePatterns)) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Detect provider from URL
   * @param url The URL to analyze
   * @returns Provider enum value
   * @throws UnsupportedProviderError if provider cannot be determined
   * @throws InvalidUrlError if YouTube URL is malformed
   */
  private detectProvider(url: string): Provider {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle localhost when allowed - return a default provider for testing
    if (
      this.config.allowLocalhost &&
      (hostname === "localhost" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("192.168."))
    ) {
      // For localhost, return YouTube as default but don't validate video ID
      return Provider.YOUTUBE;
    }

    // Check if it's a YouTube URL
    const youtubeHosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "music.youtube.com",
    ];
    if (
      youtubeHosts.some(
        (host) => hostname === host || hostname.endsWith(`.${host}`),
      )
    ) {
      const videoId = this.extractYouTubeVideoId(url);
      if (videoId) {
        return Provider.YOUTUBE;
      } else {
        // This is a YouTube domain but invalid YouTube URL format
        throw new InvalidUrlError(
          `Invalid YouTube URL format: missing or invalid video ID in ${url}`,
          url,
        );
      }
    }

    throw new UnsupportedProviderError(
      `Unable to detect provider from URL: ${url}`,
      hostname,
      url,
    );
  }

  /**
   * Extract and separate tracking parameters from URL
   * @param url The URL to process
   * @returns Object with clean URL and extracted tracking parameters
   */
  private extractTrackingParameters(url: string): {
    cleanUrl: string;
    trackingParams: Record<string, string>;
  } {
    const urlObj = new URL(url);
    const trackingParams: Record<string, string> = {};

    // Common tracking parameters to remove
    const trackingParamNames = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "msclkid",
      "_ga",
      "ref",
      "source",
      "feature",
      "app",
      "attribution_link",
    ];

    // Extract tracking parameters
    trackingParamNames.forEach((param) => {
      if (urlObj.searchParams.has(param)) {
        trackingParams[param] = urlObj.searchParams.get(param) || "";
        urlObj.searchParams.delete(param);
      }
    });

    return {
      cleanUrl: urlObj.toString(),
      trackingParams,
    };
  }

  /**
   * Normalize URL format
   * @param url The URL to normalize
   * @param provider The detected provider
   * @returns Normalized URL
   */
  private normalizeUrl(url: string, provider: Provider): string {
    if (provider === Provider.YOUTUBE) {
      return this.normalizeYouTubeUrl(url);
    }

    // For unsupported providers, return the original URL
    throw new UnsupportedProviderError(
      `URL normalization not implemented for provider: ${provider}`,
      "unknown",
      url,
    );
  }

  /**
   * Normalize YouTube URL to standard format
   * @param url The YouTube URL to normalize
   * @returns Normalized YouTube URL in standard format
   */
  private normalizeYouTubeUrl(url: string): string {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Handle localhost URLs - return as-is since they're for testing
    if (
      hostname === "localhost" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("192.168.")
    ) {
      return url;
    }

    const videoId = this.extractYouTubeVideoId(url);
    if (!videoId) {
      throw new InvalidUrlError(
        "Unable to extract video ID from YouTube URL",
        url,
      );
    }

    // Return standard YouTube URL format
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  /**
   * Extract metadata from URL
   * @param url The original URL
   * @param provider The detected provider
   * @returns Metadata object or undefined if disabled
   */
  private extractMetadata(
    url: string,
    provider: Provider,
  ): Record<string, any> | undefined {
    if (!this.config.extractMetadata) {
      return undefined;
    }

    if (provider === Provider.YOUTUBE) {
      return this.extractYouTubeMetadata(url);
    }

    return {};
  }

  /**
   * Extract YouTube-specific metadata from URL
   * @param url The YouTube URL to extract metadata from
   * @returns Metadata object with timestamps, playlist info, etc.
   */
  private extractYouTubeMetadata(url: string): Record<string, any> {
    const urlObj = new URL(url);
    const metadata: Record<string, any> = {};

    // Extract timestamp (t parameter)
    const timestamp = urlObj.searchParams.get("t");
    if (timestamp) {
      metadata.timestamp = timestamp;
    }

    // Extract playlist ID
    const playlistId = urlObj.searchParams.get("list");
    if (playlistId) {
      metadata.playlistId = playlistId;
    }

    // Extract playlist index
    const index = urlObj.searchParams.get("index");
    if (index) {
      metadata.playlistIndex = parseInt(index, 10);
    }

    // Extract start time (start parameter)
    const start = urlObj.searchParams.get("start");
    if (start) {
      metadata.startTime = parseInt(start, 10);
    }

    // Extract end time (end parameter)
    const end = urlObj.searchParams.get("end");
    if (end) {
      metadata.endTime = parseInt(end, 10);
    }

    return metadata;
  }
}
