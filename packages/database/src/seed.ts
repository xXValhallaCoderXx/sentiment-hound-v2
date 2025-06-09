import {
  PrismaClient,
  SubTaskMentionStatus,
  SubTaskType,
  SubTaskStatus,
  SentimentStatus,
  TaskType,
  TaskStatus,
  BillingInterval,
} from "../generated/client";

// const userId = "cm990wl1j0000i03x67ed3r8s";

const prisma = new PrismaClient();

const seed = async () => {
  // 1) Seed plans
  const plans = [
    {
      name: "Trial",
      description: "Trial plan with basic access",
      price: 0,
      yearlyPrice: 0,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 0,
      maxTrackedKeywords: 0,
      maxCompetitors: 0,
      monthlyTokenAllowance: 0,
      features: {
        canExport: false,
      },
      isActive: true,
      displayOrder: 0,
    },
    {
      name: "Developer",
      description: "Developer plan for testing purposes",
      price: 0,
      yearlyPrice: 0,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 1,
      maxTrackedKeywords: 0,
      maxCompetitors: 0,
      monthlyTokenAllowance: 0,
      features: {
        canExport: false,
      },
      isActive: true,
      displayOrder: 1,
    },
    {
      name: "Starter",
      description: "Starter plan for small businesses",
      price: 2900, // $29.00 per month as specified in issue
      yearlyPrice: 2900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 3,
      maxTrackedKeywords: 3,
      maxCompetitors: 1,
      monthlyTokenAllowance: 300000, // 300k tokens as specified
      features: {
        canExport: false,
      },
      isActive: true,
      displayOrder: 2,
    },
    {
      name: "Pro",
      description: "Pro plan with advanced features",
      price: 9900, // $99.00 per month as specified in issue
      yearlyPrice: 9900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 10,
      maxTrackedKeywords: 10,
      maxCompetitors: 5,
      monthlyTokenAllowance: 2500000, // 2.5M tokens as specified
      features: {
        canExport: true,
      },
      isActive: true,
      displayOrder: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        billingInterval: plan.billingInterval,
        maxIntegrations: plan.maxIntegrations,
        maxTrackedKeywords: plan.maxTrackedKeywords,
        maxCompetitors: plan.maxCompetitors,
        monthlyTokenAllowance: plan.monthlyTokenAllowance,
        features: plan.features,
        isActive: plan.isActive,
        displayOrder: plan.displayOrder,
      },
      create: plan,
    });
  }

  // 2) Seed providers
  const providers = [
    {
      name: "YouTube",
      description: "Analyze comments from YouTube videos.",
      image: "/logos/youtube.png",
    },
    {
      name: "Reddit",
      description: "Analyze comments from Reddit posts.",
      image: "/logos/reddit.png",
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
  const existingUser = await prisma.user.findFirst();

  if (!existingUser) {
    throw new Error(`User with id  does not exist`);
  }

  const plan = await prisma.plan.findFirst({
    where: { name: "Developer" },
  });
  if (!plan) {
    throw new Error(
      "Developer plan not found; ensure plans are seeded properly."
    );
  }
  console.log("Plan found:", plan);
  console.log("Existing user found:", existingUser);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      plan: {
        connect: {
          id: plan.id,
        },
      },
    },
  });

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

  console.log("Seed dasssta inserted");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
