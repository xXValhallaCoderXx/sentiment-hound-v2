import { Post, Prisma, prisma } from "@repo/db";
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

  async findPostsBasedOnRemoteIds(videoIds: string[]): Promise<Post[]> {
    return this.repository.findMany({ remoteId: { in: videoIds } });
  }

  async getUserIntegrationPosts({
    userId,
    integrationId,
  }: {
    userId: string;
    integrationId: string;
  }): Promise<Post[]> {
    return this.findUserIntegrationPosts({
      userId,
      integrationId: parseInt(integrationId),
    });
  }

  async findUserIntegrationPosts({
    userId,
    integrationId,
    args,
  }: {
    userId: string;
    integrationId: number;
    args?: Omit<Prisma.PostFindManyArgs, "where">;
  }): Promise<Post[]> {
    return this.repository.findMany({ userId, integrationId }, args);
  }

  async findByUserId(
    userId: string,
    args?: Omit<Prisma.PostFindManyArgs, "where">
  ): Promise<Post[]> {
    return this.repository.findMany({ userId }, args);
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.findByUserId(userId);
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

  async createUserPosts(data: Prisma.PostCreateManyInput[]) {
    return this.repository.createMany({ data });
  }

  async batchCreateComments(data: Prisma.CommentCreateManyInput[]) {
    return prisma.comment.createMany({ data });
  }
}
