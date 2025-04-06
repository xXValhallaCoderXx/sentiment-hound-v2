import { Prisma } from "@repo/db";

export interface IGetUserParams {
  id: string;
  args?: Omit<Prisma.UserFindUniqueArgs, "where">;
}
