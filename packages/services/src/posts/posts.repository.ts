import { IPostRepository, IPost } from "./posts.interface";

export class PostRepository implements IPostRepository {
  constructor(private prisma: any) {}

  async create(post: Partial<IPost>): Promise<IPost> {
    return this.prisma.post.create({ data: post });
  }

  async findById(id: number): Promise<IPost | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<IPost[]> {
    return this.prisma.post.findMany({ where: { userId } });
  }

  async findByIntegrationId(integrationId: number): Promise<IPost[]> {
    return this.prisma.post.findMany({ where: { integrationId } });
  }

  async update(id: number, data: Partial<IPost>): Promise<IPost> {
    return this.prisma.post.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
