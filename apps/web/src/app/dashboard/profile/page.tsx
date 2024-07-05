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
import { userService } from "services";

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await userService.getUserById(userId as string);
  return (
    <Box className="px-6 py-4">
      <Title>Profile</Title>
      <Stack className="mt-4 mb-8">
        <TextInput label="Name" readOnly value={user?.name ?? ""} />
        <TextInput label="Email" readOnly value={user?.email ?? ""} />
        <Avatar src={user?.image} size="md" radius="md" />
      </Stack>
      <Title>Plan</Title>
      <Stack className="mt-4">
        <TextInput
          label="Current Plan"
          readOnly
          value={user?.plan?.name ?? ""}
        />
        <Text size="sm">{user?.plan?.description}</Text>
      </Stack>
    </Box>
  );
};

export default ProfilePage;
