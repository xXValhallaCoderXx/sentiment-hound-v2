import { prisma } from "database";
import { GetUserIntegrationPostsDTO } from "./post.dto";

export class PostsRepository {
  async getUserIntegrationPosts(data: GetUserIntegrationPostsDTO) {
    const { userId, integrationId } = data;
    return await prisma.post.findMany({
      where: {
        userId: userId,
        integrationId: parseInt(integrationId),
      },
    });
  }
}

export const postsRepository = new PostsRepository();
