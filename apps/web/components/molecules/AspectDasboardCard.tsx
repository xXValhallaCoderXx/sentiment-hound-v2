import { FC } from "react";
import { IconArrowNarrowUp } from "@tabler/icons-react";
import { Card, Title, Text, Flex } from "@mantine/core";

interface IAspectDashboardCardProps {
  title?: string;
  description?: string;
  sentimentType?: string;
  icon?: any;
  redirectCta?: {
    label: string;
    href: string;
  };
}

const AspectDashboardCard: FC<IAspectDashboardCardProps> = ({
  title = "No Data Found",
  description,
}) => {
  return (
    <Card w="100%" withBorder>
      <Flex>
        <Title order={5} mb={8}>
          {title}
        </Title>
        <IconArrowNarrowUp
          size={16}
          color="green"
          style={{ marginLeft: "auto", marginTop: 4 }}
        />
      </Flex>
      <Text>{description}</Text>
    </Card>
  );
};
export default AspectDashboardCard;
