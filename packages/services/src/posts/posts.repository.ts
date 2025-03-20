import { BaseRepository } from "../common/base.repository";
import { PrismaClient, Post, Prisma } from "@repo/db";

export class PostRepository extends BaseRepository<"post"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "post");
  }

  async findByUserId(
    userId: string,
    args?: Omit<Prisma.PostFindManyArgs, "where">
  ): Promise<Post[]> {
    return this.findMany({ userId }, args);
  }

  async findByIntegrationId(
    integrationId: number,
    args?: Omit<Prisma.PostFindManyArgs, "where">
  ): Promise<Post[]> {
    return this.findMany({ integrationId }, args);
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
    return this.findMany({ userId, integrationId }, args);
  }
}
