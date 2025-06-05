import { FC } from "react";
import { Flex, Avatar, Text, Badge, Title, Group } from "@mantine/core";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IDashboardCommentCardProps {
  // This interface is intentionally empty as the component currently uses hardcoded data.
  // Props can be added here if the component needs to receive data dynamically in the future.
}

const DashboardCommentCard: FC<IDashboardCommentCardProps> = () => {
  return (
    <Flex gap={8} direction="column" p={8}>
      <Group gap="xs" align="center" wrap="wrap">
        <Avatar />
        <Title order={4} fz={{ base: 'sm', sm: 'md' }}>Sara Jonson</Title> {/* Responsive font size */}
        <Text c="dimmed" size="sm">@sarajon</Text>
        <Text c="dimmed" size="xs" ml="auto"> {/* Push time to the right if space allows, will wrap otherwise */}
          2 Hrs ago
        </Text>
      </Group>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
        ligula id nunc facilisis fringilla. Aenean nec dui ac velit fringilla
        efficitur. Sed ut enim euismod, aliquet felis id, vehicula risus. In hac
        habitasse platea dictumst.
      </Text>
      <Flex gap={16} align="center">
        <Badge color="gray" variant="light">
          2 hours ago
        </Badge>
        <Text>Reply</Text>
      </Flex>
    </Flex>
  );
};

export default DashboardCommentCard;
