import { prisma } from "database";
import { integrationsService } from "../integrations/integrations.service";

class YoutubeService {
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

    const data = await response.json();

    console.log("Refresh Token Response", data);

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const { access_token } = data;

    await prisma.integration.update({
      where: { id, userId },
      data: { accessToken: access_token },
    });

    return access_token;
  }
  async fetchYoutubePosts(userId: string) {
    // const { accessToken, refreshToken } =
    try {
      const youtubeIntegration = await integrationsService.getUserIntegration(
        userId,
        "youtube"
      );
      if (!youtubeIntegration) {
        throw new Error("YouTube integration not found for user");
      }

      console.log("Youtube Integration", youtubeIntegration);

      const headers = {
        Authorization: `Bearer ${youtubeIntegration.accessToken}`,
      };

      // const accessToken = await this.refreshAccessToken(userId);
      // console.log("Access Token", accessToken);

      const channelResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
        {
          headers,
        }
      );
      let channelData = await channelResponse.json();
      console.log("Channel Data", channelData);

      if (channelData.error?.code === 401) {
        const newAccessToken = await this.refreshAccessToken(userId);
        console.log("New Access Token", newAccessToken);
        headers.Authorization = `Bearer ${newAccessToken}`;
      }

      const uploadsPlaylistId =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Step 2: Fetch videos from the upload playlist
      let videos: any = [];
      let nextPageToken = "";

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

      // Map the comment count to the videos
      videos = videos.map((video: any) => {
        const videoDetail = videoDetailsData.items.find(
          (detail: any) => detail.id === video.id
        );
        return {
          ...video,
          commentCount: videoDetail.statistics.commentCount,
        };
      });

      if (videoDetailsResponse.status !== 200) {
        throw new Error("Failed to fetch video details");
      }

      return videos;
    } catch (error: any) {
      console.log("Error", error);
      return [];
    }
  }
}

export const youtubeService = new YoutubeService();
