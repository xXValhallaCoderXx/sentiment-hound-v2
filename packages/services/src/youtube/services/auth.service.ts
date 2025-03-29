import {
  IGenerateAuthFromCodeResponse,
  IYoutubeRefeshTokenResponse,
  IYoutubeRefreshToken,
} from "../youtube.interface";
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

    const token: IGenerateAuthFromCodeResponse = await tokenResponse.json();

    const accessToken = token.access_token;
    const refreshToken = token.refresh_token;

    return { accessToken, refreshToken, expiresIn: token.expires_in };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<IYoutubeRefreshToken> {
    const params = new URLSearchParams();
    params.append(
      "client_id",
      "80558175919-njvaidu8l8b2b8kgruefbs364im90ia9.apps.googleusercontent.com" as string
    );
    params.append(
      "client_secret",
      "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" as string
    );
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");
    console.log("GOOGLE ID: ", process.env.AUTH_GOOGLE_ID);
    console.log("GOOGLE SECRET: ", process.env.AUTH_GOOGLE_SECRET);
    console.log("REFRESH TOKEN: ", refreshToken);

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    console.log("REFRESH RESPONSE: ", response);
    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const responseResult: IYoutubeRefeshTokenResponse = await response.json();

    const { expires_in, access_token } = responseResult;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      refreshToken,
      expiresAt,
      expiresIn: expires_in,
    };
  }

  async revokeToken(refreshToken: string) {
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${refreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to revoke token");
    }

    return true;
  }
}
