import { YoutubeAuthService } from "./auth.service";
import { integrationsService } from "../..";
import { youtubeService } from "../youtube.services";
import { AuthenticationMethod, YoutubeAuthConfig } from "../youtube.types";

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
    // Since this method uses OAuth headers, we can determine the auth method
    const videoDetails = await this.fetchVideoDetails(videoIds, currentAccessToken, 'OAUTH');
    console.log("VIDEO DETAILS: ", videoDetails);

    // Add this line to fetch comments
    console.log("Fetching comments for videos...");
    const videoComments = await this.fetchCommentsForVideos(videoIds, currentAccessToken, 'OAUTH');
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

  async fetchVideoDetails(videoIds: string[], authToken: string, authMethod: 'OAUTH' | 'API_KEY') {
    if (videoIds.length === 0) return [];

    // Build request configuration using explicit authentication
    const baseUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}`;
    const requestConfig = this.buildRequestConfig(authToken, authMethod, baseUrl);

    const videoDetailsResponse = await fetch(requestConfig.url, { 
      headers: requestConfig.headers 
    });

    if (!videoDetailsResponse.ok) {
      // Check for quota exceeded error
      if (videoDetailsResponse.status === 403) {
        const errorData = await videoDetailsResponse.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || '';
        
        if (errorMessage.toLowerCase().includes('quota') || 
            errorMessage.toLowerCase().includes('exceeded')) {
          throw new Error(`YouTube API quota has been exceeded. Please try again later or contact support if this persists.`);
        }
        
        // Other 403 errors (permission issues)
        throw new Error(`Access denied to YouTube API. Please check your authentication credentials.`);
      }
      
      throw new Error(`Failed to fetch video details: ${videoDetailsResponse.statusText}`);
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

  async fetchCommentsForVideos(videoIds: string[], authToken: string, authMethod: 'OAUTH' | 'API_KEY') {
    const allComments: Record<string, any[]> = {};

    for (const videoId of videoIds) {
      const comments = await this.fetchVideoComments(videoId, authToken, authMethod);
      allComments[videoId] = comments;
    }

    return allComments;
  }

  async fetchVideoComments(
    videoId: string, 
    authToken: string,
    authMethod: 'OAUTH' | 'API_KEY',
    maxResults = 100
  ) {
    let comments: any[] = [];
    let nextPageToken = "";

    // Build request configuration using explicit authentication
    const baseUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}`;
    let requestConfig = this.buildRequestConfig(authToken, authMethod, baseUrl);

    try {
      do {
        // Update URL with pagination token if needed
        let currentUrl = requestConfig.url;
        if (nextPageToken) {
          const separator = currentUrl.includes('?') ? '&' : '?';
          currentUrl = `${currentUrl}${separator}pageToken=${nextPageToken}`;
        }

        const commentsResponse = await fetch(currentUrl, { 
          headers: requestConfig.headers 
        });

        if (!commentsResponse.ok) {
          // Comments might be disabled for this video
          if (commentsResponse.status === 403) {
            const errorData = await commentsResponse.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || '';
            
            // Check for quota exceeded specifically
            if (errorMessage.toLowerCase().includes('quota') || 
                errorMessage.toLowerCase().includes('exceeded')) {
              throw new Error(`YouTube API quota has been exceeded. Please try again later or contact support if this persists.`);
            }
            
            // Regular 403 might just mean comments are disabled
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
    authToken: string,
    authMethod: 'OAUTH' | 'API_KEY',
    videoUrl: string
  ): Promise<IFetchAllYoutubePostsResponse | null> {
    // Extract video ID from URL
    const videoId = this.extractVideoIdFromUrl(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube video URL");
    }

    // Build request configuration using provided auth token
    const baseVideoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`;
    const requestConfig = this.buildRequestConfig(authToken, authMethod, baseVideoUrl);

    // Get video details
    try {
      // Fetch video data
      const videoResponse = await fetch(requestConfig.url, { 
        headers: requestConfig.headers 
      });

      if (!videoResponse.ok) {
        // Check for quota exceeded error
        if (videoResponse.status === 403) {
          const errorData = await videoResponse.json().catch(() => ({}));
          const errorMessage = errorData?.error?.message || '';
          
          if (errorMessage.toLowerCase().includes('quota') || 
              errorMessage.toLowerCase().includes('exceeded')) {
            throw new Error(`YouTube API quota has been exceeded. Please try again later or contact support if this persists.`);
          }
          
          // Other 403 errors
          throw new Error(`Access denied to YouTube video. The video may be private or restricted.`);
        }
        
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
      // Use the provided authToken for comment fetching
      const comments = await this.fetchVideoComments(videoId, authToken, authMethod, 100);
      
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



  /**
   * Builds the appropriate request configuration based on explicit authentication method.
   * 
   * For OAuth tokens:
   * - Adds Authorization: Bearer header
   * - Returns original URL unchanged
   * 
   * For API keys:
   * - Appends key parameter to URL query string
   * - Handles existing query parameters correctly
   * - URL-encodes the API key for safety
   * - Returns empty headers object
   * 
   * @param token The authentication token (OAuth or API key)
   * @param authMethod The explicit authentication method to use
   * @param baseUrl The base URL for the API request
   * @returns Object containing the final URL and headers for the HTTP request
   */
  private buildRequestConfig(token: string, authMethod: 'OAUTH' | 'API_KEY', baseUrl: string): { url: string; headers: any } {
    if (authMethod === 'OAUTH') {
      // OAuth: use Authorization header
      return {
        url: baseUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
    } else {
      // API Key: append to URL parameters
      const separator = baseUrl.includes('?') ? '&' : '?';
      return {
        url: `${baseUrl}${separator}key=${encodeURIComponent(token)}`,
        headers: {}
      };
    }
  }
}

