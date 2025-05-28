import { Prisma, User } from "@repo/db";
import { UserRepository } from "./users.repository";
import { IGetUserParams } from "./user.interface";

export class CoreUserService {
  constructor(private repository: UserRepository) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.repository.findUnique({ email });
  }

  findUserById(data: IGetUserParams): Promise<User | null> {
    return this.repository.findById(data.id, data?.args);
  }

  updateUser(
    id: string,
    data: Partial<User>,
    args?: Omit<Prisma.UserUpdateArgs, "where" | "data">
  ): Promise<User> {
    return this.repository.update(id, data, args);
  }
}
