import { FC } from "react";
// Import useMantineTheme
import { Flex, Avatar, Text, Badge, Title, useMantineTheme } from "@mantine/core";

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
  const theme = useMantineTheme(); // Get the theme object

  return (
    <Flex gap={8} direction="column" p={8}>
      <Flex gap={8} align="center">
        <Avatar />
        <Title order={4}>Sara Jonson</Title>
        {/* Use theme color for gray text */}
        <Text c={theme.colors.gray[6]}>@sarajon</Text>
        <Text c={theme.colors.gray[6]} size="xs">
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
        {/* Badge color should already use theme if 'gray' is a theme color.
            If a specific shade is needed, it can be theme.colors.gray[shade].
            Assuming 'gray' as a direct color prop is sufficient for now. */}
        <Badge color="gray" variant="light">
          2 hours ago
        </Badge>
        <Text>Reply</Text>
      </Flex>
    </Flex>
  );
};

export default DashboardCommentCard;
