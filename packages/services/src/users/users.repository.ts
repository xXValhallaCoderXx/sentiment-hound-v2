import { BaseRepository } from "../common/base.repository";
import { User, PrismaClient, Prisma } from "@repo/db";

export class UserRepository extends BaseRepository<"user"> {
  constructor(prisma: PrismaClient) {
    super(prisma, "user");
  }

  async findByEmail(
    email: string,
    args?: Omit<Prisma.UserFindFirstArgs, "where">
  ): Promise<User | null> {
    return this.findFirst({ email }, args);
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    args?: Omit<Prisma.UserUpdateArgs, "where" | "data">
  ): Promise<User> {
    return super.update(id, data, args);
  }
}
