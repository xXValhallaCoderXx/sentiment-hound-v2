import { prisma } from "database";
import { integrationsService } from "../integrations/integrations.service";
import jwt from "jsonwebtoken";

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp: number } | null;

    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token");
    }

    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    return expirationDate <= currentDate;
  } catch (error) {
    console.error("Failed to decode token", error);
    return true; // If there's an error decoding the token, assume it's expired
  }
}

class YoutubeService {
  async refreshAccessToken(userId: string) {
    const { accessToken, refreshToken, id } =
      await integrationsService.getUserIntegration(userId, "youtube");

    if (!accessToken) {
      throw new Error("YouTube integration not found for user");
    }

    const params = new URLSearchParams();
    params.append("client_id", process.env.AUTH_GOOGLE_ID);
    params.append("client_secret", process.env.AUTH_GOOGLE_SECRET);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }
    console.log("DATAAAA: ", data);
    const { access_token } = data;

    await prisma.integration.update({
      where: { id, userId },
      data: { accessToken: access_token },
    });

    return access_token;
  }
  async fetchYoutubePosts(userId: string) {
    // const { accessToken, refreshToken } =
    //   await integrationsService.getUserIntegration(userId, "youtube");
    const accessToken = await this.refreshAccessToken(userId);
    console.log("Access Token", accessToken);
    console.log("IS TOKEN EXPIRED", isTokenExpired(accessToken));
    try {
      const channelResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const channelData = await channelResponse.json();
      console.log("Channel Data", channelData);
    } catch (error: any) {
      console.log("Error", error.message);
    }
  }
}

export const youtubeService = new YoutubeService();
