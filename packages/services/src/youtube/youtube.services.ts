import {
  IConnectYoutubeIntegration,
  IYoutubeRefreshToken,
} from "./youtube.interface";

import { YoutubeAuthService } from "./services/auth.service";
import { YoutubeProfileService } from "./services/profile.service";
import { YoutubeContentService } from "./services/content.service";

export class YoutubeService {
  private authService: YoutubeAuthService;
  private profileService: YoutubeProfileService;
  private contentService: YoutubeContentService;

  constructor() {
    this.authService = new YoutubeAuthService();
    this.profileService = new YoutubeProfileService();
    this.contentService = new YoutubeContentService(this.authService);
  }

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

  async refreshAccessToken(
    refreshToken: string
  ): Promise<IYoutubeRefreshToken> {
    return this.authService.refreshAccessToken(refreshToken);
  }

  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    return this.authService.revokeToken(refreshToken);
  }

  // async fetchYoutubePosts(userId: string, retry = true): Promise<IYouTubePost[]> {
  //   return this.contentService.fetchYoutubePosts(userId, retry);
  // }

  async fetchAllYoutubePosts(userId: string) {
    return this.contentService.fetchAllYoutubePosts(userId);
  }
}

export const youtubeService = new YoutubeService();
