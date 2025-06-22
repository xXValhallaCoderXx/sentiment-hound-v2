"use server";
import { postService, ICreatePost, integrationsService } from "@repo/services";

import { auth } from "@/lib/next-auth.lib";
import { youtubeService } from "@repo/services";
import { revalidatePath } from "next/cache";
import { ActionResponse, createErrorResponse } from "@/lib/types";

export async function fetchAllUserPosts(): Promise<ActionResponse<boolean>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        data: null,
        error: createErrorResponse({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
          statusCode: 401,
        }),
      };
    }

    // Fetch the YouTube posts using the service
    // const userPosts = await youtubeService.fetchYoutubePosts(userId);

    // const postData: ICreatePost[] = userPosts?.map((post) => ({
    //   userId: userId,
    //   title: post.title,
    //   commentCount: parseInt(post.commentCount),
    //   description: post.description,
    //   publishedAt: post.publishedAt,
    //   imageUrl: post.thumbnail,
    //   postUrl: post.thumbnail,
    //   remoteId: post.id,
    //   integrationId: 0,
    //   content: "",
    //   id: parseInt(post.id),
    // }));

    // console.log("POST DATA: ", postData);

    // postService.createUserPosts(postData);

    // Revalidate the page to show the new data
    revalidatePath("/dashboard/posts/youtube");

    return { data: true, error: null };
  } catch (error: any) {
    console.error("Error refreshing YouTube posts:", error);
    return {
      data: null,
      error: createErrorResponse(error, "Failed to refresh YouTube posts"),
    };
  }
}

export async function analyzeYoutubePosts(): Promise<ActionResponse<boolean>> {
  try {
    // Implement post analysis functionality here
    // For now, we'll just return success
    return { data: true, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}

export async function refreshAccessToken(): Promise<ActionResponse<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    const userId = session.user.id;

    const x = await integrationsService.getUserIntegrationByName(
      userId,
      "youtube"
    );

    if (!x?.refreshToken) {
      throw new Error("No refresh token found for user");
    }

    const result = await youtubeService.refreshAccessToken(x?.refreshToken);

    return { data: true, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: createErrorResponse(error),
    };
  }
}
