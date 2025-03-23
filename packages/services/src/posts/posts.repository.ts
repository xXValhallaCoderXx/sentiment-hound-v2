import { Post, PrismaClient, Prisma } from "@repo/db";

export class PostRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.PostCreateArgs): Promise<Post> {
    return this.prisma.post.create(args);
  }

  async createMany(args: Prisma.PostCreateManyArgs) {
    return this.prisma.post.createMany(args);
  }

  async findAll(args?: Prisma.PostFindManyArgs): Promise<Post[]> {
    return this.prisma.post.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.PostFindUniqueArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.post.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.PostWhereUniqueInput,
    args?: Omit<Prisma.PostFindUniqueArgs, "where">
  ) {
    return this.prisma.post.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.PostWhereInput,
    args?: Omit<Prisma.PostFindFirstArgs, "where">
  ) {
    return this.prisma.post.findFirst({
      where,
      ...args,
    });
  }

  async findMany(
    where: Prisma.PostWhereInput,
    args?: Omit<Prisma.PostFindManyArgs, "where">
  ) {
    return this.prisma.post.findMany({
      where,
      ...args,
    });
  }

  async update(
    id: string | number,
    data: Prisma.PostUpdateInput,
    args?: Omit<Prisma.PostUpdateArgs, "where" | "data">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.post.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.PostDeleteArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.post.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.PostWhereInput,
    args?: Omit<Prisma.PostCountArgs, "where">
  ) {
    return this.prisma.post.count({
      where,
      ...args,
    });
  }
}
