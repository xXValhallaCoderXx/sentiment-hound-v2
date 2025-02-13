// import { auth } from "@/lib/next-auth.lib";

import Link from "next/link";
import {
  Avatar,
  Flex,
  Box,
  Text,
  Title,
  Stack,
  Notification,
} from "@mantine/core";
// import { userService, planService } from "services";
import Plans from "./components/Plans";

const ProfilePage = async (props: any) => {
  // const session = await auth();
  // const userId = session?.user?.id;
  // const user = await userService.getUserById(userId as string);
  // const plans = await planService.getPlans();
  const user = {};
  const plans = [];
  return (
    <Box className="px-6 py-4">
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
    </Box>
  );
};

export default ProfilePage;
