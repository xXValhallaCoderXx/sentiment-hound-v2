"use server";
import { auth } from "@/lib/next-auth.lib";
import { integrationsService, youtubeService } from "services";

export const fetchPostsAction = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;

  const youtubePosts = await youtubeService.fetchYoutubePosts(
    session?.user?.id as string
  );
  return youtubePosts;
};
