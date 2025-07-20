import { Mention, PrismaClient, Prisma } from "@repo/db";

export class MentionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.MentionCreateArgs): Promise<Mention> {
    return this.prisma.mention.create(args);
  }

  async createMany(args: Prisma.MentionCreateManyArgs) {
    return this.prisma.mention.createMany(args);
  }

  async findAll(args?: Prisma.MentionFindManyArgs): Promise<Mention[]> {
    return this.prisma.mention.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.MentionFindUniqueArgs, "where">,
  ): Promise<Mention | null> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.mention.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.MentionWhereUniqueInput,
    args?: Omit<Prisma.MentionFindUniqueArgs, "where">,
  ): Promise<Mention | null> {
    return this.prisma.mention.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.MentionWhereInput,
    args?: Omit<Prisma.MentionFindFirstArgs, "where">,
  ): Promise<Mention | null> {
    return this.prisma.mention.findFirst({
      where,
      ...args,
    });
  }

  async findMany(args?: Prisma.MentionFindManyArgs): Promise<Mention[]> {
    return this.prisma.mention.findMany(args || {});
  }

  async update(
    id: string | number,
    data: Prisma.MentionUpdateInput,
    args?: Omit<Prisma.MentionUpdateArgs, "where" | "data">,
  ): Promise<Mention> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.mention.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.MentionDeleteArgs, "where">,
  ): Promise<Mention> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.mention.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.MentionWhereInput,
    args?: Omit<Prisma.MentionCountArgs, "where">,
  ): Promise<number> {
    return this.prisma.mention.count({
      where,
      ...args,
    });
  }
}
