import { Box, Avatar, Text, Badge, Stack, Group, Flex } from "@mantine/core";
import { userService } from "@repo/services";
import Image from "next/image";
import dayjs from "dayjs";

interface IProfileCardProps {
  id: string;
}

const ProfileCard = async ({ id }: IProfileCardProps) => {
  const user = await userService.findUserById({
    id,
    args: {
      include: {
        plan: true,
      },
    },
  });

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <Box>
      <Group>
        <Avatar src={user.image} radius="xl" size="lg" />

        <Stack gap={0}>
          <Text fw={500} size="md">
            {user.name || "Unknown User"}
          </Text>
          <Text size="sm" c="dimmed">
            {user.email}
          </Text>
          <Text size="sm" c="dimmed">
            Member since: {dayjs(new Date(user.createdAt)).format("DD/MM/YYYY")}
          </Text>
        </Stack>
      </Group>

      <Flex align="center" mt={16} gap={8}>
        <Text size="md" fw={500}>
          Current Plan:
        </Text>
        <Badge color="dark" radius="sm" size="md">
          {/* @ts-ignore */}
          {user?.plan?.name || "Free"}
        </Badge>
      </Flex>
    </Box>
  );
};

export default ProfileCard;
