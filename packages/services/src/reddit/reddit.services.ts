import { RedditContentService } from "./services/content.service";
import { RedditAuthService } from "./services/auth.service";

export class RedditService {
  private contentService: RedditContentService;
  private authService: RedditAuthService;

  constructor() {
    this.contentService = new RedditContentService();
    this.authService = new RedditAuthService();
  }

  async addNewKeyword(userId: string) {
    // Logic to add a new keyword
    return true;
  }

  async fetchAllPosts(userId: string) {
    return this.contentService.fetchPosts(userId);
  }

  async searchMention(keyword: string, accessToken?: string) {
    return this.contentService.searchMention(keyword, accessToken);
  }

  async connectRedditIntegration(code: string) {
    return this.authService.generateAuthFromCode(code);
  }

  async refreshAccessToken(refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  async revokeIntegration(accessToken: string) {
    return this.authService.revokeToken(accessToken);
  }

  generateAuthUrl(state: string) {
    return this.authService.generateAuthUrl(state);
  }
}

export const redditService = new RedditService();
