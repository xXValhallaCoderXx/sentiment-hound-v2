import { FC } from "react";
import {
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconLine,
} from "@tabler/icons-react";
import { Card, Title, Text, Flex } from "@mantine/core";

export interface IDashboardSentimentCardProps {
  title?: string;
  description?: string;
  sentimentType?: string;
  showIcon?: boolean;
  icon?: any;
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
  // Determine which icon to display based on sentiment type
  const getSentimentIcon = () => {
    if (icon) {
      // If custom icon is provided, use it
      const CustomIcon = icon;
      return (
        <CustomIcon
          size={ICON_SIZE}
          style={{ marginLeft: "auto", marginTop: 4 }}
        />
      );
    }

    if (!showIcon) {
      return null;
    }

    // Choose icon based on sentiment type
    switch (sentimentType.toLowerCase()) {
      case "positive":
        return (
          <IconArrowNarrowUp
            size={ICON_SIZE}
            color="green"
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
      case "negative":
        return (
          <IconArrowNarrowDown
            size={ICON_SIZE}
            color="red"
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
      case "neutral":
      default:
        return (
          <IconLine
            size={ICON_SIZE}
            color="gray"
            style={{ marginLeft: "auto", marginTop: 4 }}
          />
        );
    }
  };

  return (
    <Card w="100%" withBorder>
      <Flex>
        <Title order={5} mb={8}>
          {title}
        </Title>
        {getSentimentIcon()}
      </Flex>
      <Title order={2} fw={700}>
        {description}
      </Title>
    </Card>
  );
};
export default DashboardSentimentCard;
