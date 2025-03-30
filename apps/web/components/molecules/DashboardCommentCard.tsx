import { FC } from "react";
import { Flex, Avatar, Text, Badge, Title } from "@mantine/core";

interface IDashboardCommentCardProps {
  title?: string;
  description?: string;
  sentimentType?: string;
  icon?: any;
}

const DashboardCommentCard: FC<IDashboardCommentCardProps> = ({
  title,
  description,
  sentimentType,
  icon,
}) => {
  return (
    <Flex gap={8} direction="column" p={8}>
      <Flex gap={8} align="center">
        <Avatar />
        <Title order={4}>Sara Jonson</Title>
        <Text c="gray">@sarajon</Text>
        <Text c="gray" size="xs">
          2 Hrs ago
        </Text>
      </Flex>
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
