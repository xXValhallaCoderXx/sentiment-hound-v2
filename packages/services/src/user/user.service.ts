import { prisma, TaskStatus, TaskType, JobStatus, User } from "database";
import { CreateUserDto } from "./user.dto";

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

  async setupNewUserAccount(data: CreateUserDto): Promise<User> {
    // Find the default trial plan
    const trialPlan = await prisma.plan.findFirst({
      where: {
        name: "trial",
      },
    });

    if (!trialPlan) {
      throw new Error("Default trial plan not found");
    }

    // Create a new user and assign the trial plan
    console.log("Creating new user with trial plan", data.id);
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        plan: {
          connect: { id: trialPlan.id },
        },
      },
    });

    return user;
  }

  async createFetchCommentsTask(userId: string, videoUrl: string) {
    // const post = await prisma.post.create({
    //   data: {
    //   content: videoUrl,
    //     user: { connect: { id: userId } },
    //   },
    // });

    const task = await prisma.task.create({
      data: {
        type: TaskType.FETCH_COMMENTS,
        status: TaskStatus.PENDING,
        user: { connect: { id: userId } },
      },
    });

    await prisma.job.create({
      data: {
        status: JobStatus.PENDING,
        task: { connect: { id: task.id } },
      },
    });

    return task;
  }
}

export const userService = new UserService();
