import { prisma, TaskStatus, TaskType, JobStatus, User } from "database";
import { CreateUserDto } from "./user.dto";
import { planService } from "../plans/plans.service";

class UserService {
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

  async setupNewUserAccount(data: CreateUserDto): Promise<User> {
    // Find the default trial plan
    const trialPlan = await planService.getPlanByName("trial");

    if (!trialPlan) {
      throw new Error("Default trial plan not found");
    }

    // Create a new user and assign the trial plan
    console.log("Creating new user with trial plan", data.id);
    const user = await this.updateUserPlan(data.id, trialPlan.id);

    return user;
  }
}

export const userService = new UserService();
