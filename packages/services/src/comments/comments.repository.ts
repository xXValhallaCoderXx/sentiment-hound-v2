import { Comment, PrismaClient, Prisma } from "@repo/db";

export class CommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.CommentCreateArgs): Promise<Comment> {
    return this.prisma.comment.create(args);
  }

  async createMany(args: Prisma.CommentCreateManyArgs) {
    return this.prisma.comment.createMany(args);
  }

  async findAll(args?: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return this.prisma.comment.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.CommentFindUniqueArgs, "where">
  ): Promise<Comment | null> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.comment.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.CommentWhereUniqueInput,
    args?: Omit<Prisma.CommentFindUniqueArgs, "where">
  ): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.CommentWhereInput,
    args?: Omit<Prisma.CommentFindFirstArgs, "where">
  ): Promise<Comment | null> {
    return this.prisma.comment.findFirst({
      where,
      ...args,
    });
  }

  async findMany(args?: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return this.prisma.comment.findMany(args || {});
  }

  async update(
    id: string | number,
    data: Prisma.CommentUpdateInput,
    args?: Omit<Prisma.CommentUpdateArgs, "where" | "data">
  ): Promise<Comment> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.comment.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.CommentDeleteArgs, "where">
  ): Promise<Comment> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.comment.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.CommentWhereInput,
    args?: Omit<Prisma.CommentCountArgs, "where">
  ): Promise<number> {
    return this.prisma.comment.count({
      where,
      ...args,
    });
  }
}
