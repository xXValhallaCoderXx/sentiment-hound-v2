import { RedditMention, RedditComment } from "../reddit.interface";

export class RedditContentService {
  private readonly userAgent = process.env.REDDIT_USER_AGENT || "sentiment-hound-v2:1.0.0";
  
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

    const res = await fetch(apiUrl, { headers });

    if (!res.ok) {
      throw new Error(`Reddit API error: ${res.status} ${res.statusText}`);
    }

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

    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`Reddit comments API error: ${res.status} ${res.statusText}`);
    }

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
