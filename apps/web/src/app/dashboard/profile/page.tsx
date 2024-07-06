import { auth } from "@/lib/next-auth.lib";
import {
  Avatar,
  Card,
  Flex,
  Box,
  Text,
  Title,
  Container,
  TextInput,
  Center,
  Stack,
} from "@mantine/core";
import { userService, planService } from "services";
import Plans from "./components/Plans";

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await userService.getUserById(userId as string);
  const plans = await planService.getPlans();

  return (
    <Box className="px-6 py-4">
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
      <Plans plans={plans} userPlan={user?.plan} />
    </Box>
  );
};

export default ProfilePage;
