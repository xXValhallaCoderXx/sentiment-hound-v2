// Import services from centralized location (uncomment when index.ts is created)
// Import services from centralized location (uncomment when index.ts is created)
import { IYouTubePost } from "./youtube.interface";
import { providerService, integrationsService } from "../index";
import { YoutubeAuthService } from "./services/auth.service";
import { YoutubeProfileService } from "./services/profile.service";
import { YoutubeContentService } from "./services/content.service";

export class YoutubeService {
  private authService: YoutubeAuthService;
  private profileService: YoutubeProfileService;
  private contentService: YoutubeContentService;

  constructor() {
    this.authService = new YoutubeAuthService();
    this.profileService = new YoutubeProfileService();
    this.contentService = new YoutubeContentService(this.authService);
  }

  async connectYoutubeIntegration(code: string, userId: string) {
    const { accessToken, refreshToken, expiresIn } =
      await this.authService.generateAuthFromCode(code);

    const userInfo = await this.profileService.getUserProfile(accessToken);

    const youtubeAccountId = userInfo.id;
    const refreshTokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
    const youtubeProvider = await providerService.getProviderByName("youtube");

    if (!youtubeProvider) {
      throw new Error("YouTube provider not found");
    }

    await integrationsService.createIntegration({
      providerId: youtubeProvider.id,
      accessToken,
      refreshToken,
      accountId: youtubeAccountId,
      userId,
      refreshTokenExpiresAt,
    });

    return true;
  }

  async refreshAccessToken(refreshToken: string) {
    const youtubeProvider = await providerService.getProviderByName("youtube");

    if (!youtubeProvider) {
      throw new Error("YouTube provider not found");
    }

    const x = this.authService.refreshAccessToken(refreshToken);

    //     await integrationsService.updateIntegrationAuthCredentials({
    //   providerId: youtubeProvider.id,
    //   userId,
    //   accessToken: access_token,
    //   refreshToken,
    //   accessTokenExpiry: expiresAt,
    // });
  }

  // async fetchYoutubePosts(userId: string, retry = true): Promise<IYouTubePost[]> {
  //   return this.contentService.fetchYoutubePosts(userId, retry);
  // }
}

export const youtubeService = new YoutubeService();

// import { IYouTubePost } from "./youtube.interface";
// import { providerService, integrationsService } from "../index";

// export class YoutubeService {
//   async connectYoutubeIntegration(code: string, userId: string) {
//     const { accessToken, refreshToken, expiresIn } =
//       await this.generateAuthFromCode(code);

//     const userInfo = await this.getUserProfile(accessToken);

//     const youtubeAccountId = userInfo?.id;
//     const expiresAt = new Date(Date.now() + expiresIn * 1000);
//     const youtubeProvider = await providerService.getProviderByName("youtube");

//     if (!youtubeProvider) {
//       throw new Error("YouTube provider not found");
//     }

//     await integrationsService.createIntegration({
//       providerId: youtubeProvider.id,
//       // remoteId: youtubeAccountId,
//       accessToken,
//       refreshToken,
//       accountId: youtubeAccountId,
//       // refreshTokenExpiry: expiresAt,
//       userId,
//     });

//     return true;
//   }

//   async fetchYoutubePosts(
//     userId: string,
//     retry = true
//   ): Promise<IYouTubePost[]> {
//     const youtubeIntegration =
//       await integrationsService.getUserIntegrationByName(userId, "youtube");

//     if (!youtubeIntegration) {
//       throw new Error("YouTube integration not found for user");
//     }

//     const accessTokenExpiryDate = new Date(
//       youtubeIntegration.refreshTokenExpiresAt
//     );
//     const currentTime = new Date();

//     if (accessTokenExpiryDate < currentTime) {
//       console.log("The specified time has passed.");
//       await this.refreshAccessToken(userId);
//       await this.fetchYoutubePosts(userId, false); // Prevent infinite Recursion
//     }

//     const headers = {
//       Authorization: `Bearer ${youtubeIntegration.accessToken}`,
//     };

//     const channelResponse = await fetch(
//       "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
//       {
//         headers,
//       }
//     );
//     let channelData = await channelResponse.json();

//     if (channelData.error?.code === 401 && retry) {
//       await this.refreshAccessToken(userId);
//       await this.fetchYoutubePosts(userId, false); // Prevent infinite Recursion
//     }

//     let videos: any = [];
//     let nextPageToken = "";

//     const uploadsPlaylistId =
//       channelData.items[0].contentDetails.relatedPlaylists.uploads;

//     do {
//       const playlistItemsResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}`,
//         { headers }
//       );

//       const playlistItemsData = await playlistItemsResponse.json();

//       if (playlistItemsResponse.status !== 200) {
//         throw new Error("Failed to fetch playlist items");
//       }

//       const fetchedVideos = playlistItemsData.items.map((item: any) => ({
//         id: item.snippet.resourceId.videoId,
//         title: item.snippet.title,
//         description: item.snippet.description,
//         publishedAt: item.snippet.publishedAt,
//         thumbnail: item.snippet.thumbnails.default.url,
//       }));

//       videos = [...videos, ...fetchedVideos];
//       nextPageToken = playlistItemsData.nextPageToken || "";
//     } while (nextPageToken);

//     console.log("VIDEOS: ", videos);

//     // Fetch video details including comment count
//     const videoIds = videos.map((video: any) => video.id).join(",");
//     const videoDetailsResponse = await fetch(
//       `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
//       { headers }
//     );

//     const videoDetailsData = await videoDetailsResponse.json();

//     videos = videos.map((video: any) => {
//       const videoDetail = videoDetailsData.items.find(
//         (detail: any) => detail.id === video.id
//       );

//       return {
//         ...video,
//         commentCount: videoDetail.statistics.commentCount,
//       };
//     });

//     return videos;
//   }
// }

// export const youtubeService = new YoutubeService();
