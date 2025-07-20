export interface IYouTubePost {
  id: string;
  title: string;
  description: string;
  publishedAt: Date;
  thumbnail: string;
  commentCount: string;
}

export interface IYoutubeRefreshToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface IYoutubeRefeshTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token_expires_in: number;
}

export interface IGenerateAuthFromCodeResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token_expires_in: number;
}

export interface IGetUserProfileResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
}

export interface IConnectYoutubeIntegration {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  youtubeAccountId: string;
  refreshTokenExpiresAt: Date;
}

export interface IGetYoutubePlaylistItemsResponse {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}
