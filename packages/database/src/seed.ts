import {
  PrismaClient,
  SubTaskCommentStatus,
  SubTaskType,
  SubTaskStatus,
  SentimentStatus,
  TaskType,
  TaskStatus,
} from "../generated/client";

// const userId = "cm990wl1j0000i03x67ed3r8s";

const prisma = new PrismaClient();

const seed = async () => {
  // 1) Seed plans
  const plans = [
    { name: "trial", description: "Trial plan with limited features" },
    { name: "starter", description: "Starter plan with basic features" },
    { name: "premium", description: "Premium plan with all features" },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }

  // 2) Seed providers
  const providers = [
    {
      name: "youtube",
      description:
        "Fetch all the comments from your youtube videos and analyze their sentiment.",
      image: "youtube-logo.png",
    },
    {
      name: "instagram",
      description:
        "Fetch all the comments from your instagram posts and analyze their sentiment.",
      image: "instagram-logo.png",
    },
    {
      name: "facebook",
      description:
        "Fetch all the comments from your facebook posts and analyze their sentiment.",
      image: "facebook-logo.png",
    },
  ];

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { name: provider.name },
      update: {},
      create: provider,
    });
  }

  // 3) Ensure a user with userId = "user-1" exists
  // const existingUser = await prisma.user.findUnique({
  //   where: { id: userId },
  // });

  // if (!existingUser) {
  //   throw new Error(`User with id ${userId} does not exist`);
  // } else {
  //   console.log(`User ${userId} already exists.`);
  // }

  // 4) Create or use an existing provider for the Integration
  // const [defaultProvider] = await prisma.provider.findMany({
  //   take: 1,
  //   orderBy: { id: "asc" },
  // });
  // if (!defaultProvider) {
  //   throw new Error("No provider found; ensure providers are seeded properly.");
  // }

  // 5) Create or upsert an Integration for our test user
  // const integration = await prisma.integration.create({
  //   data: {
  //     accountId: `account-${defaultProvider.name}-demo`,
  //     accessToken: "accessTokenSample",
  //     refreshToken: "refreshTokenSample",
  //     refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  //     userId,
  //     providerId: defaultProvider.id,
  //     isActive: true,
  //   },
  // });

  // 6) Create some posts (3 for example), each with random 3-5 comments
  // const postData = Array.from({ length: 3 }).map((_, idx) => ({
  //   remoteId: `remote-post-${idx + 1}`,
  //   title: `Sample Post #${idx + 1}`,
  //   description: `Description for sample post #${idx + 1}`,
  //   postUrl: `http://example.com/post${idx + 1}`,
  //   imageUrl: `http://example.com/post${idx + 1}.png`,
  //   publishedAt: new Date(),
  //   isBlacklisted: false,
  //   commentCount: 0,
  //   userId,
  //   integrationId: integration.id,
  // }));

  // const createdPosts = await prisma.post.createMany({ data: postData });
  // // Re-fetch them with IDs
  // const posts = await prisma.post.findMany({
  //   where: { userId, integrationId: integration.id },
  //   orderBy: { id: "asc" },
  // });

  // for (const post of posts) {
  //   const numberOfComments = Math.floor(Math.random() * 3) + 3; // 3-5
  //   const commentsData = Array.from({ length: numberOfComments }).map(
  //     (_, cdx) => ({
  //       commentId: `comment-${post.id}-${cdx + 1}`,
  //       content: `Comment ${cdx + 1} on ${post.title}`,
  //       sentiment: null,
  //       score: null,
  //       sentimentStatus: SentimentStatus.PENDING,
  //       postId: post.id,
  //     })
  //   );

  //   await prisma.comment.createMany({
  //     data: commentsData,
  //   });

  //   // Update the post's commentCount
  //   await prisma.post.update({
  //     where: { id: post.id },
  //     data: {
  //       commentCount: numberOfComments,
  //     },
  //   });
  // }

  // 7) Create a couple of Tasks
  // const task1 = await prisma.task.create({
  //   data: {
  //     type: TaskType.ANALYZE_COMMENTS,
  //     status: TaskStatus.PENDING,
  //     userId,
  //     integrationId: integration.id,
  //   },
  // });

  // const task2 = await prisma.task.create({
  //   data: {
  //     type: TaskType.FETCH_CONTENT,
  //     status: TaskStatus.IN_PROGRESS,
  //     userId,
  //     integrationId: integration.id,
  //   },
  // });

  // 8) Create some SubTasks for each Task
  // const subTask1 = await prisma.subTask.create({
  //   data: {
  //     type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
  //     status: SubTaskStatus.PENDING,
  //     taskId: task1.id,
  //     data: { note: "Batch #1 - analyzing comments" },
  //   },
  // });

  // const subTask2 = await prisma.subTask.create({
  //   data: {
  //     type: SubTaskType.FETCH_CONTENT,
  //     status: SubTaskStatus.IN_PROGRESS,
  //     taskId: task1.id,
  //     data: { note: "Fetching something else" },
  //   },
  // });

  // const subTask3 = await prisma.subTask.create({
  //   data: {
  //     type: SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT,
  //     status: SubTaskStatus.PENDING,
  //     taskId: task2.id,
  //     data: { note: "Task2 subTask" },
  //   },
  // });

  // 9) Grab all the comments, link some to each subTask via SubTaskComment pivot
  // const allComments = await prisma.comment.findMany({
  //   where: { post: { userId } },
  //   orderBy: { id: "asc" },
  // });

  // We'll slice them in groups
  // const sliceSize = Math.floor(allComments.length / 3) || 1;
  // const commentsForSubTask1 = allComments.slice(0, sliceSize);
  // const commentsForSubTask2 = allComments.slice(sliceSize, sliceSize * 2);
  // const commentsForSubTask3 = allComments.slice(sliceSize * 2);

  // for (const c of commentsForSubTask1) {
  //   await prisma.subTaskComment.create({
  //     data: {
  //       subTaskId: subTask1.id,
  //       commentId: c.id,
  //       status: SubTaskCommentStatus.PENDING,
  //       analysis: null,
  //     },
  //   });
  // }

  // for (const c of commentsForSubTask2) {
  //   await prisma.subTaskComment.create({
  //     data: {
  //       subTaskId: subTask2.id,
  //       commentId: c.id,
  //       status: SubTaskCommentStatus.IN_PROGRESS,
  //       analysis: "Partial analysis text...",
  //     },
  //   });
  // }

  // for (const c of commentsForSubTask3) {
  //   // Let's simulate a completed analysis on these
  //   await prisma.subTaskComment.create({
  //     data: {
  //       subTaskId: subTask3.id,
  //       commentId: c.id,
  //       status: SubTaskCommentStatus.COMPLETED,
  //       analysis: "Fully analyzed for subTask3",
  //     },
  //   });

  //   // Update the Comment with final sentiment data + aspect analyses
  //   await prisma.comment.update({
  //     where: { id: c.id },
  //     data: {
  //       sentiment: "POSITIVE",
  //       score: "0.92",
  //       sentimentStatus: SentimentStatus.COMPLETED,
  //       aspectAnalyses: {
  //         createMany: {
  //           data: [
  //             {
  //               aspect: "Price",
  //               sentiment: "NEUTRAL",
  //               score: "0.50",
  //             },
  //             {
  //               aspect: "Quality",
  //               sentiment: "POSITIVE",
  //               score: "0.80",
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   });
  // }

  console.log("Seed data inserted");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
