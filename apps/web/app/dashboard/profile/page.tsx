import { auth } from "@/lib/next-auth.lib";
import PageLayout from "@/components/templates/PageLayout";
import Link from "next/link";
import {
  Avatar,
  Card,
  Flex,
  Box,
  Text,
  Title,
  Stack,
  Notification,
} from "@mantine/core";
import ProfileCard from "./components/ProfileCard";
// import { userService, planService } from "services";
import Plans from "./components/Plans";

const ProfilePage = async (props: any) => {
  const session = await auth();
  const userId = session?.user?.id;
  console.log("USER ID: ", userId);
  // const user = await userService.getUserById(userId as string);
  // const plans = await planService.getPlans();
  const user = {};
  const plans = [];
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
        <Card withBorder>
          <Title order={4}>Plans</Title>
        </Card>
      </Stack>
      {/* {props?.searchParams?.planUpdated === "true" && (
        <Box pos="absolute" right={60} top={60}>
          <Link href="/dashboard/profile">
            <Notification
              icon={<CheckCircle />}
              color="teal"
              title="Plan updated!"
              mt="md"
            >
              You have successfully updated your plan
            </Notification>
          </Link>
        </Box>
      )}
      <Flex className="gap-3">
        <Title>Profile</Title>
        <Avatar
          src={user?.image}
          className="rounded-full"
          size="md"
          radius="md"
        />
      </Flex>
      <Box className="mt-4">
        <Title order={4}>Basic Information</Title>
        <Stack className="mt-2 mb-8">
          <Flex className="items-center gap-2">
            <Title order={6}>Name</Title>
            <Text size="sm">{user?.name}</Text>
          </Flex>
          <Flex className="items-center gap-2">
            <Title order={6}>Email</Title>
            <Text size="sm">{user?.email}</Text>
          </Flex>
        </Stack>
      </Box>
      <Title>Plan</Title>
      <Plans plans={plans} userPlan={user?.plan} /> */}
    </PageLayout>
  );
};

export default ProfilePage;
