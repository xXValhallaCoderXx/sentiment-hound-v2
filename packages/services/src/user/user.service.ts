import { prisma, TaskStatus, TaskType, JobStatus } from "database";
// import { UpdateUserDto } from "./user.dto";

class UserService {
  async getUsers() {
    return await prisma.user.findMany();
  }

  async integrateSocialAccount(
    userId: string,
    provider: string,
    accountId: string,
    accessToken: string
  ) {
    return prisma.socialAccount.create({
      data: {
        provider,
        accountId,
        accessToken,
        user: { connect: { id: userId } },
      },
    });
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
