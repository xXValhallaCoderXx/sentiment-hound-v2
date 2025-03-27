import { Provider, PrismaClient, Prisma } from "@repo/db";

export class ProviderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.ProviderCreateArgs): Promise<Provider> {
    return this.prisma.provider.create(args);
  }

  async findAll(args?: Prisma.ProviderFindManyArgs): Promise<Provider[]> {
    return this.prisma.provider.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.ProviderFindUniqueArgs, "where">
  ): Promise<Provider | null> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.provider.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.ProviderWhereUniqueInput,
    args?: Omit<Prisma.ProviderFindUniqueArgs, "where">
  ): Promise<Provider | null> {
    return this.prisma.provider.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.ProviderWhereInput,
    args?: Omit<Prisma.ProviderFindFirstArgs, "where">
  ): Promise<Provider | null> {
    return this.prisma.provider.findFirst({
      where,
      ...args,
    });
  }

  async findMany(
    where: Prisma.ProviderWhereInput,
    args?: Omit<Prisma.ProviderFindManyArgs, "where">
  ): Promise<Provider[]> {
    return this.prisma.provider.findMany({
      where,
      ...args,
    });
  }

  async update(
    id: string | number,
    data: Prisma.ProviderUpdateInput,
    args?: Omit<Prisma.ProviderUpdateArgs, "where" | "data">
  ): Promise<Provider> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.provider.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.ProviderDeleteArgs, "where">
  ): Promise<Provider> {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.provider.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.ProviderWhereInput,
    args?: Omit<Prisma.ProviderCountArgs, "where">
  ): Promise<number> {
    return this.prisma.provider.count({
      where,
      ...args,
    });
  }

  async findByName(name: string): Promise<Provider | null> {
    return this.findFirst({ name });
  }

  async findByUserId(userId: string): Promise<Provider[]> {
    return this.prisma.provider.findMany({
      where: {
        integrations: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
