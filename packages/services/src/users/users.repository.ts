// import { BaseRepository } from "../common/base.repository";
// import { User, PrismaClient, Prisma } from "@repo/db";

// export class UserRepository extends BaseRepository<"user"> {
//   constructor(prisma: PrismaClient) {
//     super(prisma, "user");
//   }

//   async findByEmail(
//     email: string,
//     args?: Omit<Prisma.UserFindFirstArgs, "where">
//   ): Promise<User | null> {
//     return this.findFirst({ email }, args);
//   }

//   async update(
//     id: string,
//     data: Prisma.UserUpdateInput,
//     args?: Omit<Prisma.UserUpdateArgs, "where" | "data">
//   ): Promise<User> {
//     return super.update(id, data, args);
//   }
// }

import { User, PrismaClient, Prisma } from "@repo/db";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async createMany(args: Prisma.UserCreateManyArgs) {
    return this.prisma.user.createMany(args);
  }

  async findAll(args?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args || {});
  }

  async findById(id: string, args?: Omit<Prisma.UserFindUniqueArgs, "where">) {
    return this.prisma.user.findUnique({
      where: { id },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.UserWhereUniqueInput,
    args?: Omit<Prisma.UserFindUniqueArgs, "where">,
  ) {
    return this.prisma.user.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.UserWhereInput,
    args?: Omit<Prisma.UserFindFirstArgs, "where">,
  ) {
    return this.prisma.user.findFirst({
      where,
      ...args,
    });
  }

  async findMany(args: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }

  async update(
    id: string | number,
    data: Prisma.UserUpdateInput,
    args?: Omit<Prisma.UserUpdateArgs, "where" | "data">,
  ) {
    return this.prisma.user.update({
      where: { id: String(id) },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.UserDeleteArgs, "where">,
  ) {
    return this.prisma.user.delete({
      where: { id: String(id) },
      ...args,
    });
  }

  async count(
    where: Prisma.UserWhereInput,
    args?: Omit<Prisma.UserCountArgs, "where">,
  ) {
    return this.prisma.user.count({
      where,
      ...args,
    });
  }
}
