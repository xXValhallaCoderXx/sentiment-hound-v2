import { auth } from "@/lib/next-auth.lib";
import PageLayout from "@/components/templates/PageLayout";
import { Card, Flex, Box, Title, Stack } from "@mantine/core";
import ProfileCard from "./components/ProfileCard";
import Plans from "./components/Plans";

const ProfilePage = async ({
  searchParams,
}: {
  searchParams: { status?: string };
}) => {
  const session = await auth();
  const userId = session?.user?.id;
  const params = await searchParams;
  return (
    <PageLayout title="Profile" description="User profile page">
      <Stack gap={16}>
        <Flex gap={16}>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title order={4}>Plan</Title>
              <ProfileCard id={String(userId)} />
            </Card>
          </Flex>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title order={4}>Billing and Payment</Title>
            </Card>
          </Flex>
        </Flex>
      </Stack>
      <Box mt={24}>
        <Title order={3}>Subscription Details</Title>
        <Plans searchParams={params} />
      </Box>
    </PageLayout>
  );
};

export default ProfilePage;
