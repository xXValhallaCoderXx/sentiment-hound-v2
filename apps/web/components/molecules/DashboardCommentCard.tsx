import { FC } from "react";
import { Flex, Avatar, Text, Badge, Title, Group } from "@mantine/core";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IDashboardCommentCardProps {
  // This interface is intentionally empty as the component currently uses hardcoded data.
  // Props can be added here if the component needs to receive data dynamically in the future.
}

const DashboardCommentCard: FC<IDashboardCommentCardProps> = () => {
  return (
    <Flex gap={12} direction="column" p={{ base: 12, sm: 16 }} 
          style={{ 
            border: "1px solid #e9ecef",
            borderRadius: "8px", 
            backgroundColor: "#f8f9fa" 
          }}>
      <Group gap="xs" align="center" wrap="wrap">
        <Avatar size="sm" />
        <Title order={5} fz={{ base: 'sm', sm: 'md' }} fw={600}>
          Sara Jonson
        </Title>
        <Text c="dimmed" size="sm">@sarajon</Text>
        <Text c="dimmed" size="xs" ml="auto">
          2 Hrs ago
        </Text>
      </Group>
      <Text size="sm" lineClamp={3}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
        ligula id nunc facilisis fringilla. Aenean nec dui ac velit fringilla
        efficitur. Sed ut enim euismod, aliquet felis id, vehicula risus. In hac
        habitasse platea dictumst.
      </Text>
      <Flex gap={16} align="center">
        <Badge color="gray" variant="light" size="sm">
          2 hours ago
        </Badge>
        <Text size="sm" c="primary" style={{ cursor: "pointer" }}>
          Reply
        </Text>
      </Flex>
    </Flex>
  );
};

export default DashboardCommentCard;
