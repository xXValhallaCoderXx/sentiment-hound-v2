import { prisma } from "database";
import { integrationsService } from "../integrations/integrations.service";
import jwt from "jsonwebtoken";

function isTokenExpired(token: string): boolean {
  console.log("TOKEN: ", token);
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
    try {
      const youtubeIntegration = await integrationsService.getUserIntegration(
        userId,
        "youtube"
      );

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
      const channelData = await channelResponse.json();

      const uploadsPlaylistId =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Step 2: Fetch videos from the upload playlist
      let videos = [];
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
      const videoIds = videos.map((video) => video.id).join(",");
      const videoDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
        { headers }
      );

      const videoDetailsData = await videoDetailsResponse.json();

      // Map the comment count to the videos
      videos = videos.map((video) => {
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
      console.log("Error", error.message);
      return [];
    }
  }
}

export const youtubeService = new YoutubeService();
