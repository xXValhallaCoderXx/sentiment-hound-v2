import { auth } from "@/lib/next-auth.lib";
import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";
import { Text } from "@mantine/core";
import { prisma } from "@repo/db";
import ProfileContent from "./components/ProfileContent";

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <DashboardLayout>
        <Text>User not authenticated.</Text>
      </DashboardLayout>
    );
  }

  // Fetch user data with plan and usage information
  const user = await prisma.user.findUnique({
    where: {
      id: String(userId),
    },
    include: {
      plan: true,
    },
  });

  if (!user) {
    return (
      <DashboardLayout>
        <Text>User data not available.</Text>
      </DashboardLayout>
    );
  }

  // Prepare plan data for PlanUsageCard
  const planData = user.plan
    ? {
        id: user.plan.id,
        name: user.plan.name,
        description: user.plan.description || "",
        price: user.plan.price ? Number(user.plan.price) : 0,
        yearlyPrice: user.plan.yearlyPrice
          ? Number(user.plan.yearlyPrice)
          : undefined,
        billingInterval: user.plan.billingInterval,
        maxIntegrations: user.plan.maxIntegrations,
        maxTrackedKeywords: user.plan.maxTrackedKeywords,
        maxCompetitors: user.plan.maxCompetitors,
        monthlyTokenAllowance: user.plan.monthlyTokenAllowance,
        features: user.plan.features,
        isActive: user.plan.isActive,
        displayOrder: user.plan.displayOrder,
      }
    : undefined;

  // Prepare token usage data
  const tokenUsage = {
    current: user.tokenUsageThisPeriod,
    limit: user.plan?.monthlyTokenAllowance || 10000,
    periodEnd: user.currentPeriodEnd,
    isOverage:
      user.tokenUsageThisPeriod > (user.plan?.monthlyTokenAllowance || 10000),
    percentage: user.plan?.monthlyTokenAllowance
      ? (user.tokenUsageThisPeriod / user.plan.monthlyTokenAllowance) * 100
      : 0,
  };

  return (
    <DashboardLayout>
      <ProfileContent planData={planData} tokenUsage={tokenUsage} />
    </DashboardLayout>
  );
};

export default ProfilePage;
