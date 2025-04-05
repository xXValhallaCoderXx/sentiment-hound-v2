import { Prisma, User } from "@repo/db";
import { UserRepository } from "./users.repository";

export class CoreUserService {
  constructor(private repository: UserRepository) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.repository.findUnique({ email });
  }

  findUserById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  updateUser(
    id: string,
    data: Partial<User>,
    args?: Omit<Prisma.UserUpdateArgs, "where" | "data">
  ): Promise<User> {
    return this.repository.update(id, data, args);
  }
}
