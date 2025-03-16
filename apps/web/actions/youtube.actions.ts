"use server";
import { postService, ICreatePost } from "@repo/services";

import { auth } from "@/lib/next-auth.lib";
import { youtubeService } from "@repo/services";
import { revalidatePath } from "next/cache";

interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

type ActionResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ErrorResponse };

export async function fetchAllUserPosts(): Promise<ActionResponse<boolean>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        data: null,
        error: {
          error: "User not authenticated",
          code: "UNAUTHORIZED",
          status: 401,
        },
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
      error: {
        error: error.message || "Failed to refresh YouTube posts",
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
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
      error: {
        error: error.message,
        code: error.code || "UNKNOWN_ERROR",
        status: error.statusCode || 500,
      },
    };
  }
}
