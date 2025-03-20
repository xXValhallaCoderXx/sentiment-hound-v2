import { YoutubeAuthService } from "./auth.service";
import { integrationsService } from "../..";

export class YoutubeContentService {
  constructor(private authService: YoutubeAuthService) {}
  async fetchYoutubePosts(userId: string, retry = true) {
    // ...fetch channel, playlist items, and comment counts...
    // ...handle token refresh via this.authService if needed...
  }
  async fetchAllYoutubePosts(userId: string, retry = true) {
    // ...fetch channel, playlist items, and comment counts...
    // ...handle token refresh via this.authService if needed...
    const youtubeIntegration =
      await integrationsService.getUserIntegrationByName(userId, "youtube");

    if (!youtubeIntegration) {
      throw new Error("YouTube integration not found for user");
    }

    const accessTokenExpiryDate = new Date(
      youtubeIntegration.refreshTokenExpiresAt
    );
    const currentTime = new Date();

    if (accessTokenExpiryDate < currentTime) {
      console.log("The specified time has passed.");
    }

    console.log("CARRY ON");
  }
}


//   async fetchYoutubePosts(
//     userId: string,
//     retry = true
//   ): Promise<IYouTubePost[]> {
    // const youtubeIntegration =
    //   await integrationsService.getUserIntegrationByName(userId, "youtube");

    // if (!youtubeIntegration) {
    //   throw new Error("YouTube integration not found for user");
    // }

    // const accessTokenExpiryDate = new Date(
    //   youtubeIntegration.refreshTokenExpiresAt
    // );
    // const currentTime = new Date();

    // if (accessTokenExpiryDate < currentTime) {
    //   console.log("The specified time has passed.");
    //   await this.refreshAccessToken(userId);
    //   await this.fetchYoutubePosts(userId, false); // Prevent infinite Recursion
    // }

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