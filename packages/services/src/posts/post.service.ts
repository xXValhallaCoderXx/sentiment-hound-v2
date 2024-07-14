import { prisma } from "database";
import { GetPostsDto } from "./post.dto";

class PostService {
  async getPosts(dto: GetPostsDto) {
    const { page = 1, limit = 10, search } = dto;
    const offset = (page - 1) * limit;

    const where: any = {};

    // if (content) {
    //   where.content = { contains: content, mode: "insensitive" };
    // }

    // if (videoUrl) {
    //   where.videoUrl = { contains: videoUrl, mode: "insensitive" };
    // }

    const posts = await prisma.post.findMany({
      where,
      skip: offset,
      take: limit,
    });

    const totalPosts = await prisma.post.count({ where });

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  }
}

export const postService = new PostService();
