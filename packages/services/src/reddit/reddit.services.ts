import { RedditContentService } from "./services/content.service";

export class RedditService {
  private contentService: RedditContentService;

  constructor() {
    this.contentService = new RedditContentService();
  }

  async addNewKeyword(userId: string) {
    // Logic to add a new keyword
    return true;
  }

  async fetchAllPosts(userId: string) {
    return this.contentService.fetchPosts(userId);
  }
}

export const redditService = new RedditService();
