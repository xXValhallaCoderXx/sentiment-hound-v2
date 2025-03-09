import { BaseRepository } from "../common/base.repository";
import { User } from "@repo/db";

export class UserRepository extends BaseRepository<User, string> {
  constructor(prisma: any) {
    super(prisma, "user");
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findUnique({ email });
  }
}
