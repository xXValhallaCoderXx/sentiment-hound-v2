export interface RedditMention {
  id: string;
  content: string;
  author: string;
  permalink: string;
  subreddit: string;
  createdAt: Date;
  comments?: RedditComment[];
}

export interface RedditComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}
