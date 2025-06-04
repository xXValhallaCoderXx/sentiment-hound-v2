import { Box, Avatar, Text, Badge, Stack, Group, Flex } from "@mantine/core";
import dayjs from "dayjs";

interface IProfileCardProps {
  user: {
    image: string | null;
    name: string | null;
    email: string;
    createdAt: Date;
    plan: { name: string } | null;
  };
}

const ProfileCard = async ({ user }: IProfileCardProps) => {
  return (
    <Box>
      <Group>
        <Avatar src={user?.image} radius="xl" size="lg" />

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
          {user?.plan?.name || "Free"}
        </Badge>
      </Flex>
    </Box>
  );
};

export default ProfileCard;
