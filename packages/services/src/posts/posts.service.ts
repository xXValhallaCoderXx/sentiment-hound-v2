import { IPost, IPostRepository } from "./posts.interface";

export class CorePostService {
  constructor(private repository: IPostRepository) {}

  async getPost(id: number): Promise<IPost> {
    const post = await this.repository.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  async getUserPosts(userId: string): Promise<IPost[]> {
    return this.repository.findByUserId(userId);
  }
}
