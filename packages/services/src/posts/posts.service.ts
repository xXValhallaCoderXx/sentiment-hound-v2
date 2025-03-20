import { Post } from "@repo/db";
import { PostRepository } from "./posts.repository";
import { ICreatePost } from "./post.interface";
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
    return this.repository.findUserIntegrationPosts({
      userId,
      integrationId: parseInt(integrationId),
    });
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.repository.findByUserId(userId);
  }

  async createUserPost(data: ICreatePost): Promise<Post> {
    const { userId, title } = data;
    return this.repository.create({
      data: {
        userId,
        title,
        commentCount: data?.commentCount || 0,
        description: data?.description || "",
        publishedAt: data?.publishedAt || new Date(),
        imageUrl: data?.imageUrl || "",
        postUrl: data?.postUrl || "",
        remoteId: data?.remoteId || "",
        integrationId: data?.integrationId || 0,
      },
    });
  }

  async createUserPosts(data: ICreatePost[]): Promise<Post[]> {
    return this.repository.batchCreate(data);
  }
}
