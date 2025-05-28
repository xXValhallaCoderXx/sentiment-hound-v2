import { YoutubeAuthService } from "./auth.service";
import { integrationsService } from "../..";
import { youtubeService } from "../youtube.services";

interface IYoutubeDetailsResponse {
  kind: string;
  etag: string;
  items: IYoutubeDetail[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface IYoutubeDetail {
  kind: string;
  etag: string;
  id: string;
  statistics: any;
}

interface IYoutubeVideoStatistics {
  commentCount: string;
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  favoriteCount: string;
}

interface IYoutubeComment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl: string;
  textDisplay: string;
  textOriginal: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  totalReplyCount: number;
}

export interface IFetchAllYoutubePostsResponse {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  statistics: IYoutubeVideoStatistics;
  comments: IYoutubeComment[];
}

export class YoutubeContentService {
  constructor(private authService: YoutubeAuthService) {}
  async fetchYoutubePosts(userId: string, retry = true) {
    // ...fetch channel, playlist items, and comment counts...
    // ...handle token refresh via this.authService if needed...
  }
  async fetchAllYoutubePosts(
    userId: string,
    retry = true
  ): Promise<IFetchAllYoutubePostsResponse[]> {
    const youtubeIntegration =
      await integrationsService.getUserIntegrationByName(userId, "youtube");

    if (!youtubeIntegration) {
      throw new Error("YouTube integration not found for user");
    }

    const accessTokenExpiryDate = new Date(
      youtubeIntegration.refreshTokenExpiresAt
    );
    const currentTime = new Date();
    let currentAccessToken = youtubeIntegration.accessToken;
    if (accessTokenExpiryDate < currentTime) {
      console.log("ACCESS TOKEN EXPIRED");
      const refreshToken = await youtubeService.refreshAccessToken(
        youtubeIntegration?.refreshToken
      );
      console.log("NEW TOKEN: ", refreshToken);

      await integrationsService.updateIntegrationAuthCredentials({
        userId,
        providerId: youtubeIntegration.providerId,
        accessToken: refreshToken.accessToken,
        refreshToken: refreshToken.refreshToken,
        accessTokenExpiry: refreshToken.expiresAt,
      });
      console.log("REFESH DONE");
    }

    const headers = {
      Authorization: `Bearer ${currentAccessToken}`,
    };

    const uploadsPlaylistId = await this.fetchUploadsPlaylistId(headers);
    let videos = await this.fetchVideosFromPlaylist(uploadsPlaylistId, headers);

    const videoIds = videos.map((video) => video.id);
    console.log("VIDEOS: ", videoIds);
    const videoDetails = await this.fetchVideoDetails(videoIds, headers);
    console.log("VIDEO DETAILS: ", videoDetails);

    // Add this line to fetch comments
    console.log("Fetching comments for videos...");
    const videoComments = await this.fetchCommentsForVideos(videoIds, headers);
    console.log("Comments fetched successfully");

    return videos.map((video) => ({
      ...video,
      statistics: videoDetails[video.id] || null,
      comments: videoComments[video.id] || [], // Include comments in the response
    }));
  }

  async fetchUploadsPlaylistId(headers: any) {
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
      { headers }
    );

    const channelData = await channelResponse.json();

    if (channelData.error?.code === 401) {
      throw new Error("Unauthorized access. Token might need refreshing.");
    }

    return channelData.items[0].contentDetails.relatedPlaylists.uploads;
  }

  async fetchVideosFromPlaylist(uploadsPlaylistId: string, headers: any) {
    let videos: any[] = [];
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

    return videos;
  }

  async fetchVideoDetails(videoIds: string[], headers: any) {
    if (videoIds.length === 0) return [];

    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}`,
      { headers }
    );

    if (!videoDetailsResponse.ok) {
      throw new Error("Failed to fetch video details");
    }

    const videoDetailsData: IYoutubeDetailsResponse =
      await videoDetailsResponse.json();

    return videoDetailsData.items.reduce((acc: any, detail: IYoutubeDetail) => {
      acc[detail.id] = {
        ...detail.statistics,
      };
      return acc;
    }, {});
  }

  async fetchCommentsForVideos(videoIds: string[], headers: any) {
    const allComments: Record<string, any[]> = {};

    for (const videoId of videoIds) {
      const comments = await this.fetchVideoComments(videoId, headers);
      allComments[videoId] = comments;
    }

    return allComments;
  }

  async fetchVideoComments(videoId: string, headers: any, maxResults = 100) {
    let comments: any[] = [];
    let nextPageToken = "";

    try {
      do {
        const commentsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&pageToken=${nextPageToken}`,
          { headers }
        );

        if (!commentsResponse.ok) {
          // Comments might be disabled for this video
          if (commentsResponse.status === 403) {
            console.log(`Comments might be disabled for video: ${videoId}`);
            return [];
          }
          throw new Error(
            `Failed to fetch comments for video ${videoId}: ${commentsResponse.statusText}`
          );
        }

        const commentsData = await commentsResponse.json();

        const fetchedComments =
          commentsData.items?.map((item: any) => ({
            id: item.id,
            authorDisplayName:
              item.snippet.topLevelComment.snippet.authorDisplayName,
            authorProfileImageUrl:
              item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            authorChannelUrl:
              item.snippet.topLevelComment.snippet.authorChannelUrl,
            textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
            textOriginal: item.snippet.topLevelComment.snippet.textOriginal,
            likeCount: item.snippet.topLevelComment.snippet.likeCount,
            publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
            updatedAt: item.snippet.topLevelComment.snippet.updatedAt,
            totalReplyCount: item.snippet.totalReplyCount,
          })) || [];

        comments = [...comments, ...fetchedComments];
        nextPageToken = commentsData.nextPageToken || "";
      } while (nextPageToken);

      return comments;
    } catch (error) {
      console.error(`Error fetching comments for video ${videoId}:`, error);
      return [];
    }
  }

  async fetchSingleYoutubeVideo(
    userId: string,
    videoUrl: string
  ): Promise<IFetchAllYoutubePostsResponse | null> {
    const youtubeIntegration =
      await integrationsService.getUserIntegrationByName(userId, "youtube");

    if (!youtubeIntegration) {
      throw new Error("YouTube integration not found for user");
    }

    // Extract video ID from URL
    const videoId = this.extractVideoIdFromUrl(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube video URL");
    }

    // Check token and refresh if needed
    const accessTokenExpiryDate = new Date(
      youtubeIntegration.refreshTokenExpiresAt
    );
    const currentTime = new Date();
    let currentAccessToken = youtubeIntegration.accessToken;

    if (accessTokenExpiryDate < currentTime) {
      console.log("ACCESS TOKEN EXPIRED");
      const refreshToken = await youtubeService.refreshAccessToken(
        youtubeIntegration?.refreshToken
      );
      console.log("NEW TOKEN: ", refreshToken);

      await integrationsService.updateIntegrationAuthCredentials({
        userId,
        providerId: youtubeIntegration.providerId,
        accessToken: refreshToken.accessToken,
        refreshToken: refreshToken.refreshToken,
        accessTokenExpiry: refreshToken.expiresAt,
      });

      currentAccessToken = refreshToken.accessToken;
      console.log("REFRESH DONE");
    }

    const headers = {
      Authorization: `Bearer ${currentAccessToken}`,
    };

    // Get video details
    try {
      // Fetch video data
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`,
        { headers }
      );

      if (!videoResponse.ok) {
        throw new Error(
          `Failed to fetch video data: ${videoResponse.statusText}`
        );
      }

      const videoData = await videoResponse.json();

      if (!videoData.items || videoData.items.length === 0) {
        throw new Error("Video not found");
      }

      const videoItem = videoData.items[0];
      const snippet = videoItem.snippet;
      const statistics = videoItem.statistics;

      // Create video object
      const video = {
        id: videoId,
        title: snippet.title,
        description: snippet.description,
        publishedAt: snippet.publishedAt,
        thumbnail: snippet.thumbnails.default.url,
        statistics: statistics,
        comments: [], // Will be populated next
      };

      // Fetch comments for the video
      console.log(`Fetching comments for video ${videoId}...`);
      const comments = await this.fetchVideoComments(videoId, headers);
      console.log(`Fetched ${comments.length} comments for video ${videoId}`);

      // Add comments to the video object
      // @ts-ignore
      video.comments = comments;

      return video;
    } catch (error) {
      console.error(`Error fetching YouTube video ${videoId}:`, error);
      return null;
    }
  }

  private extractVideoIdFromUrl(url: string): string | null | undefined {
    // Handle different URL formats
    let videoId = null;

    // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
    const standardMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (standardMatch) {
      videoId = standardMatch[1];
    }

    // Short URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }

    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }

    return videoId;
  }
}

