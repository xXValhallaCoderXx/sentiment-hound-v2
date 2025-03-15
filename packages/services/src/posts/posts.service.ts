import { Post } from "@repo/db";
import { PostRepository } from "./posts.repository";
export class CorePostService {
  constructor(private repository: PostRepository) {}

  async getPost(id: number): Promise<Post> {
    const post = await this.repository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  async getUserIntegrationPosts({
    userId,
    integrationId,
  }: {
    userId: string;
    integrationId: string;
  }): Promise<Post[]> {
    return this.repository.findUserIntegrationPosts(
      userId,
      parseInt(integrationId)
    );
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.repository.findByUserId(userId);
  }
}
