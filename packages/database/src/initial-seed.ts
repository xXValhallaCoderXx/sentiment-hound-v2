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
