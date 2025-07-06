/**
 * YouTube Service - Provider for YouTube API Integration
 *
 * This service manages YouTube API operations including authentication,
 * profile management, and content fetching. Updated to support the
 * unified execution context pattern for job processors.
 */

import {
  IConnectYoutubeIntegration,
  IYoutubeRefreshToken,
} from "./youtube.interface";

import { YoutubeAuthService } from "./services/auth.service";
import { YoutubeProfileService } from "./services/profile.service";
import { YoutubeContentService } from "./services/content.service";

/**
 * Main YouTube service class providing integrated access to YouTube API functionality
 */
export class YoutubeService {
  private authService: YoutubeAuthService;
  private profileService: YoutubeProfileService;
  private contentService: YoutubeContentService;

  constructor() {
    this.authService = new YoutubeAuthService();
    this.profileService = new YoutubeProfileService();
    this.contentService = new YoutubeContentService(this.authService);
  }

  /**
   * Connects a YouTube integration using OAuth authorization code
   * @param code - OAuth authorization code from YouTube
   * @returns Promise resolving to integration data including tokens and user info
   */
  async connectYoutubeIntegration(
    code: string
  ): Promise<IConnectYoutubeIntegration> {
    const { accessToken, refreshToken, expiresIn } =
      await this.authService.generateAuthFromCode(code);

    const userInfo = await this.profileService.getUserProfile(accessToken);

    const youtubeAccountId = userInfo.id;
    const refreshTokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      youtubeAccountId,
      refreshTokenExpiresAt,
    };
  }

  /**
   * Refreshes an expired access token using a refresh token
   * @param refreshToken - The refresh token for the integration
   * @returns Promise resolving to new token data
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<IYoutubeRefreshToken> {
    return this.authService.refreshAccessToken(refreshToken);
  }

  /**
   * Revokes a refresh token, effectively disconnecting the integration
   * @param refreshToken - The refresh token to revoke
   * @returns Promise resolving to true if successful
   */
  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    return this.authService.revokeToken(refreshToken);
  }

  // async fetchYoutubePosts(userId: string, retry = true): Promise<IYouTubePost[]> {
  //   return this.contentService.fetchYoutubePosts(userId, retry);
  // }

  /**
   * Fetches all YouTube posts for a given user
   * @param userId - The user ID to fetch posts for
   * @returns Promise resolving to array of YouTube posts
   */
  async fetchAllYoutubePosts(userId: string) {
    return this.contentService.fetchAllYoutubePosts(userId);
  }

  /**
   * Fetches a single YouTube video with its comments using explicit authentication
   *
   * This method supports the unified execution context pattern by accepting
   * an explicit authToken parameter instead of managing authentication internally.
   *
   * @param authToken - The authentication token (OAuth or API key) to use for the request
   * @param videoUrl - The YouTube video URL to fetch
   * @returns Promise resolving to video data with comments
   */
  async fetchSingleYoutubeVideo(authToken: string, videoUrl: string) {
    return this.contentService.fetchSingleYoutubeVideo(authToken, videoUrl);
  }
}

export const youtubeService = new YoutubeService();
