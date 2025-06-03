import {
  IRedditAuthResponse,
  IRedditRefreshToken,
  IRedditTokenResponse,
} from "../reddit.interface";

export class RedditAuthService {
  private readonly clientId = process.env.REDDIT_CLIENT_ID;
  private readonly clientSecret = process.env.REDDIT_CLIENT_SECRET;
  private readonly userAgent = process.env.REDDIT_USER_AGENT || "sentiment-hound-v2:1.0.0";

  constructor() {
    if (!this.clientId || !this.clientSecret) {
      console.warn("Reddit OAuth credentials not configured. Please set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables.");
    }
  }

  async generateAuthFromCode(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    accountId: string;
  }> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Reddit OAuth credentials not configured. Please set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables.");
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/reddit/callback`;

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reddit OAuth failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const tokenData: IRedditAuthResponse = await response.json();

    if (!tokenData.access_token) {
      throw new Error("Reddit OAuth response missing access token");
    }

    // Get user info to retrieve account ID
    const userResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "User-Agent": this.userAgent,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(`Failed to fetch Reddit user info: ${userResponse.status} ${userResponse.statusText} - ${errorText}`);
    }

    const userData = await userResponse.json();

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      accountId: userData.name || userData.id,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<IRedditRefreshToken> {
    if (!refreshToken) {
      throw new Error("Reddit does not provide refresh tokens for web apps");
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh Reddit token: ${response.statusText}`);
    }

    const tokenData: IRedditTokenResponse = await response.json();
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      expiresAt,
      expiresIn: tokenData.expires_in,
    };
  }

  async revokeToken(accessToken: string): Promise<boolean> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch("https://www.reddit.com/api/v1/revoke_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: new URLSearchParams({
        token: accessToken,
        token_type_hint: "access_token",
      }),
    });

    return response.ok;
  }

  generateAuthUrl(state: string): string {
    if (!this.clientId) {
      throw new Error("Reddit client ID not configured. Please set REDDIT_CLIENT_ID environment variable.");
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/reddit/callback`;
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      state,
      redirect_uri: redirectUri,
      duration: "permanent",
      scope: "read history",
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }
}