interface IYoutubeRefreshToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: Date;
}

export class YoutubeAuthService {
  async generateAuthFromCode(code: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        code,
        client_id: process.env.AUTH_GOOGLE_ID,
        client_secret: process.env.AUTH_GOOGLE_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const token = await tokenResponse.json();

    const accessToken = token.access_token;
    const refreshToken = token.refresh_token;

    return { accessToken, refreshToken, expiresIn: token.expires_in };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<IYoutubeRefreshToken> {
    const params = new URLSearchParams();
    params.append("client_id", process.env.AUTH_GOOGLE_ID as string);
    params.append("client_secret", process.env.AUTH_GOOGLE_SECRET as string);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const responseResult = await response.json();

    const { expires_in, access_token } = responseResult;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken,
      expiresAt,
      expiresIn: expires_in,
    };
  }
}
