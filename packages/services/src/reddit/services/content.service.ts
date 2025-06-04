import { RedditMention, RedditComment } from "../reddit.interface";

export class RedditContentService {
  private readonly userAgent = process.env.REDDIT_USER_AGENT || "sentiment-hound-v2:1.0.0";
  private readonly rateLimitDelay = 1000; // 1 second delay between requests to respect rate limits
  
  private async fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (response.ok) {
          return response;
        }
        
        // If we get a rate limit error (429), wait before retrying
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.rateLimitDelay * attempt;
          console.warn(`Rate limited, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
          await this.delay(waitTime);
          continue;
        }
        
        // For other errors, throw immediately
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          console.warn(`Request failed (attempt ${attempt}/${maxRetries}), retrying...`, error);
          await this.delay(this.rateLimitDelay * attempt);
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async fetchPosts(userId: string) {
    // ...fetch channel, playlist items, and comment counts...
    // ...handle token refresh via this.authService if needed...
    return true;
  }

  async searchMention(keyword: string, accessToken?: string): Promise<RedditMention[]> {
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(
      keyword
    )}&limit=10&sort=new&type=link`;

    // Use OAuth API if token is available for better rate limits
    const apiUrl = accessToken 
      ? `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=10&sort=new&type=link`
      : searchUrl;

    const headers: Record<string, string> = {
      "User-Agent": this.userAgent,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await this.fetchWithRetry(apiUrl, { headers });

    const data = await res.json();

    const posts = data?.data?.children || [];

    const mentions: RedditMention[] = [];

    for (const post of posts) {
      const p = post.data;

      const postContent =
        p.title && p.selftext
          ? `${p.title}\n\n${p.selftext}`
          : p.title || p.selftext;

      const postItem: RedditMention = {
        id: p.id,
        content: postContent,
        author: p.author,
        permalink: `https://reddit.com${p.permalink}`,
        subreddit: p.subreddit,
        createdAt: new Date(p.created_utc * 1000),
        comments: [],
      };

      try {
        // Add delay before fetching comments to respect rate limits
        await this.delay(this.rateLimitDelay);
        const comments = await this.fetchComments(p.id, accessToken);
        postItem.comments = comments;
      } catch (err) {
        console.warn(`Could not fetch comments for post ${p.id}: ${err}`);
      }

      mentions.push(postItem);
    }

    return mentions;
  }

  async fetchComments(postId: string, accessToken?: string): Promise<RedditComment[]> {
    const url = accessToken
      ? `https://oauth.reddit.com/comments/${postId}?limit=10`
      : `https://www.reddit.com/comments/${postId}.json?limit=10`;

    const headers: Record<string, string> = {
      "User-Agent": this.userAgent,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await this.fetchWithRetry(url, { headers });

    const data = await res.json();

    const commentData = data?.[1]?.data?.children || [];

    return commentData
      .filter((item: any) => item.kind === "t1")
      .map((c: any) => ({
        id: c.data.id,
        content: c.data.body,
        author: c.data.author,
        createdAt: new Date(c.data.created_utc * 1000),
      }));
  }
}
