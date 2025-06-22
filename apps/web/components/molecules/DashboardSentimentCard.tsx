"use client";
import { FC } from "react";
import {
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconLine,
} from "@tabler/icons-react";
import { Card, Title, Flex, Text, useMantineTheme } from "@mantine/core";

export interface IDashboardSentimentCardProps {
  title?: string;
  description?: string;
  sentimentType?: string;
  showIcon?: boolean;
  icon?: React.ElementType;
  redirectCta?: {
    label: string;
    href: string;
  };
}

const ICON_SIZE = 24;

const DashboardSentimentCard: FC<IDashboardSentimentCardProps> = ({
  title = "No Data Found",
  description,
  sentimentType = "neutral",
  showIcon = true,
  icon,
}) => {
  const theme = useMantineTheme();

  // Get sentiment color from theme
  const getSentimentColor = () => {
    switch (sentimentType.toLowerCase()) {
      case "positive":
        return theme.colors.success?.[6] || theme.colors.teal[6];
      case "negative":
        return theme.colors.error?.[6] || theme.colors.red[6];
      case "neutral":
        return theme.colors.warning?.[6] || theme.colors.yellow[6];
      default:
        return theme.colors.gray[6];
    }
  };
  // Determine which icon to display based on sentiment type
  const getSentimentIcon = () => {
    const sentimentColor = getSentimentColor();

    if (icon) {
      const CustomIcon = icon;
      return (
        <CustomIcon
          size={ICON_SIZE}
          color={sentimentColor}
          style={{ marginLeft: "auto", marginTop: 4 }}
        />
      );
    }

    if (!showIcon) {
      return null;
    }

    // Choose icon based on sentiment type using theme colors
    switch (sentimentType.toLowerCase()) {
      case "positive":
        return (
          <IconArrowNarrowUp
            size={ICON_SIZE}
            color={sentimentColor}
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
      case "negative":
        return (
          <IconArrowNarrowDown
            size={ICON_SIZE}
            color={sentimentColor}
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
      case "neutral":
      default:
        return (
          <IconLine
            size={ICON_SIZE}
            color={sentimentColor}
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
    }
  };

  return (
    <Card w="100%" withBorder p="lg" radius="md" shadow="sm">
      <Flex justify="space-between" align="flex-start" mb="xs">
        <Text size="sm" c="dimmed" fw={500} tt="uppercase">
          {title}
        </Text>
        {getSentimentIcon()}
      </Flex>
      <Title order={2} fw={700} c="dark">
        {description}
      </Title>
    </Card>
  );
};
export default DashboardSentimentCard;
