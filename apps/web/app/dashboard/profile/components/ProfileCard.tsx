import {
  Box,
  Avatar,
  Text,
  Button,
  Badge,
  Stack,
  Group,
  Flex,
} from "@mantine/core";
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
  console.log("USER: ", user);
  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <Box>
      <Group>
        {user?.image ? (
          <Image
            src={user?.image}
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <Avatar src={user.image} radius="xl" size="lg" />
        )}

        <Stack gap={0}>
          <Text fw={500} size="lg">
            {user.name || "Unknown User"}
          </Text>
          <Text size="sm" color="dimmed">
            {user.email}
          </Text>
          <Text size="sm" color="dimmed">
            Member since: {dayjs(new Date(user.createdAt)).format("DD/MM/YYYY")}
          </Text>
        </Stack>
      </Group>

      <Flex align="center" mt={16} gap={8}>
        <Text size="md" fw={500}>
          Current Plan:
        </Text>
        <Badge color="dark" radius="sm" size="md">
          {/* {user.plan?.name || "Free"} */}
          Free
        </Badge>
      </Flex>
    </Box>
  );
};

export default ProfileCard;
