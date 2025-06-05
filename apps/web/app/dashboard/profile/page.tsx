import { auth } from "@/lib/next-auth.lib";
import PageLayout from "@/components/templates/PageLayout";
import { Card, Flex, Box, Title, Stack, Text } from "@mantine/core";
import ProfileCard from "./components/ProfileCard";
import Plans from "./components/Plans";
import { prisma } from "@repo/db";

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: {
      id: String(userId),
    },
    include: {
      plan: true,
    },
  });
  return (
    <PageLayout title="Profile" description="User profile page">
      <Stack gap={16}>
        <Flex gap={16}>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title ml={4} mb={4} order={3}>
                Plan
              </Title>
              {user ? (
                <ProfileCard user={user} />
              ) : (
                <Text>User data not available.</Text>
              )}
            </Card>
          </Flex>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title order={4}>Billing and Payment</Title>
            </Card>
          </Flex>
        </Flex>
      </Stack>
      {user ? (
        <Box mt={24}>
          <Title order={3}>Subscription Details</Title>
          <Plans userPlanId={String(user.planId)} />
        </Box>
      ) : null}
    </PageLayout>
  );
};

export default ProfilePage;
