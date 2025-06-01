import { RedditMention, RedditComment } from "../reddit.interface";

export class RedditContentService {
  async fetchPosts(userId: string) {
    // ...fetch channel, playlist items, and comment counts...
    // ...handle token refresh via this.authService if needed...
    return true;
  }

  async searchMention(keyword: string): Promise<RedditMention[]> {
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(
      keyword
    )}&limit=10&sort=new&type=link`;

    const res = await fetch(searchUrl);

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
        const comments = await this.fetchComments(p.id);

        postItem.comments = comments;
      } catch (err) {
        console.warn(`Could not fetch comments for post ${p.id}`);
      }

      mentions.push(postItem);
    }

    return mentions;
  }

  async fetchComments(postId: string): Promise<RedditComment[]> {
    const url = `https://www.reddit.com/comments/${postId}.json?limit=10`;
    const res = await fetch(url);
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
