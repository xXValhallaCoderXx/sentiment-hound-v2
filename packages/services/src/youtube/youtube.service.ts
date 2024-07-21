import { integrationsService } from "../integrations/integrations.service";
import { providersService } from "../providers/providers.service";
class YoutubeService {
  async connectYoutubeIntegration(code: string, userId: string) {
    const { accessToken, refreshToken, expiresIn } =
      await this.generateAuthFromCode(code);

    const userInfo = await this.getUserProfile(accessToken);

    const youtubeAccountId = userInfo?.id;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const youtubeProvider = await providersService.getProviderByName("youtube");

    if (!youtubeProvider) {
      throw new Error("YouTube provider not found");
    }

    await integrationsService.createIntegration({
      providerId: youtubeProvider.id,
      remoteId: youtubeAccountId,
      accessToken,
      refreshToken,
      refreshTokenExpiry: expiresAt,
      userId,
    });

    return true;
  }

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

  async getUserProfile(accessToken: string) {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();
    return userInfo;
  }

  async refreshAccessToken(userId: string) {
    const youtubeIntegration = await integrationsService.getUserIntegration(
      userId,
      "youtube"
    );

    if (!youtubeIntegration || !youtubeIntegration.accessToken) {
      throw new Error("YouTube integration not found for user");
    }

    const { id, refreshToken } = youtubeIntegration;
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

    const data = await response.json();

    const { expires_in, access_token } = data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await integrationsService.updateIntegrationAuthCredentials({
      providerId: id,
      userId,
      accessToken: access_token,
      refreshToken,
      accessTokenExpiry: expiresAt,
    });

    return access_token;
  }

  async fetchYoutubePosts(userId: string, retry = true) {
    const youtubeIntegration = await integrationsService.getUserIntegration(
      userId,
      "youtube"
    );
    if (!youtubeIntegration) {
      throw new Error("YouTube integration not found for user");
    }

    const accessTokenExpiryDate = new Date(
      youtubeIntegration.refreshTokenExpiresAt
    );
    const currentTime = new Date();

    if (accessTokenExpiryDate < currentTime) {
      console.log("The specified time has passed.");
      await this.refreshAccessToken(userId);
      await this.fetchYoutubePosts(userId, false); // Prevent infinite Recursion
    }

    const headers = {
      Authorization: `Bearer ${youtubeIntegration.accessToken}`,
    };

    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
      {
        headers,
      }
    );
    let channelData = await channelResponse.json();

    if (channelData.error?.code === 401 && retry) {
      await this.refreshAccessToken(userId);
      await this.fetchYoutubePosts(userId, false); // Prevent infinite Recursion
    }

    let videos: any = [];
    let nextPageToken = "";

    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    do {
      const playlistItemsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}`,
        { headers }
      );

      const playlistItemsData = await playlistItemsResponse.json();

      if (playlistItemsResponse.status !== 200) {
        throw new Error("Failed to fetch playlist items");
      }

      const fetchedVideos = playlistItemsData.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.default.url,
      }));

      videos = [...videos, ...fetchedVideos];
      nextPageToken = playlistItemsData.nextPageToken || "";
    } while (nextPageToken);

    // Fetch video details including comment count
    const videoIds = videos.map((video: any) => video.id).join(",");
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
      { headers }
    );

    const videoDetailsData = await videoDetailsResponse.json();

    videos = videos.map((video: any) => {
      const videoDetail = videoDetailsData.items.find(
        (detail: any) => detail.id === video.id
      );
      return {
        ...video,
        commentCount: videoDetail.statistics.commentCount,
      };
    });

    return videos;
  }
}

export const youtubeService = new YoutubeService();
