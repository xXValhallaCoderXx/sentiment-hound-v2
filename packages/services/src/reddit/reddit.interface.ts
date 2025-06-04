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

// OAuth interfaces
export interface IRedditAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

export interface IRedditRefreshToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface IRedditTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}
