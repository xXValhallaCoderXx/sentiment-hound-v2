import { PrismaClient, SentimentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  const plans = [
    { name: "trial", description: "Trial plan with limited features" },
    { name: "starter", description: "Starter plan with basic features" },
    { name: "premium", description: "Premium plan with all features" },
  ];

  const providers = [
    {
      name: "youtube",
      description:
        "Fetch all the comments from your youtube vidoes and analyze their sentiment.",
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

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { name: provider.name },
      update: {},
      create: provider,
    });
  }

  const trialPlan = await prisma.plan.findUnique({ where: { name: "trial" } });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Sample User",
      planId: trialPlan.id,
    },
  });

  const youtubeProvider = await prisma.provider.findUnique({
    where: { name: "youtube" },
  });

  const integration = await prisma.integration.create({
    data: {
      accountId: "sample-account-id",
      accessToken: "sample-access-token",
      refreshToken: "sample-refresh-token",
      refreshTokenExpiresAt: new Date(),
      userId: user.id,
      providerId: youtubeProvider.id,
    },
  });

  const post = await prisma.post.create({
    data: {
      postId: "sample-post-id",
      content: "This is a sample post.",
      videoUrl: "https://www.youtube.com/watch?v=sample",
      userId: user.id,
      integrationId: integration.id,
    },
  });

  const comments = [
    { commentId: "comment-1", content: "Great video!", sentiment: 0.9 },
    { commentId: "comment-2", content: "Nice work!", sentiment: 0.8 },
    { commentId: "comment-3", content: "Very informative.", sentiment: 0.85 },
    { commentId: "comment-4", content: "I learned a lot.", sentiment: 0.95 },
    { commentId: "comment-5", content: "Well explained.", sentiment: 0.87 },
    { commentId: "comment-6", content: "Good job!", sentiment: 0.9 },
    { commentId: "comment-7", content: "Thanks for sharing.", sentiment: 0.88 },
    { commentId: "comment-8", content: "Helpful video.", sentiment: 0.89 },
    { commentId: "comment-9", content: "Amazing content.", sentiment: 0.91 },
    { commentId: "comment-10", content: "Loved it!", sentiment: 0.92 },
  ];

  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        ...comment,
        sentimentStatus: SentimentStatus.COMPLETED,
        postId: post.id,
      },
    });
  }

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
