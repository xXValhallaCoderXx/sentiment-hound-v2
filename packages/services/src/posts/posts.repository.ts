import { BaseRepository } from "../common/base.repository";
import { Post } from "@repo/db";

export class PostRepository extends BaseRepository<"post"> {
  constructor(prisma: any) {
    super(prisma, "post");
  }

  async findByUserId(userId: string): Promise<Post[]> {
    return super.findMany({ where: { userId } });
  }

  async findByIntegrationId(integrationId: number): Promise<Post[]> {
    return super.findMany({ where: { integrationId } });
  }

  async findUserIntegrationPosts(
    userId: string,
    integrationId: number
  ): Promise<Post[]> {
    return super.findMany({ where: { userId, integrationId } });
  }
}
