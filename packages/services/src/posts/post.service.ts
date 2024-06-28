import { prisma } from "database";
import { CreatePostDto } from "./post.dto";

class PostService {
  async getPosts() {
    return await prisma.user.findMany();
  }
}

export const postService = new PostService();
