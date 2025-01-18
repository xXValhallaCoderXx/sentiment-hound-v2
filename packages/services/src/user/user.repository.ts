import { prisma } from "database";

export class UserRepository {
  async getUsers() {
    return await prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });
  }

  async updateUserPlan(userId: string, planId: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        plan: {
          connect: { id: planId },
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
