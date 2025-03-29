import { Paper, Flex, Title } from "@mantine/core";
import AspectDashboardCard from "@/components/molecules/AspectDasboardCard";

const aspectData = [
  {
    title: "Sentiment",
    description: "Positive",
    sentimentType: "positive",
  },
  {
    title: "Engagement",
    description: "High",
    sentimentType: "positive",
  },
  {
    title: "Reach",
    description: "Medium",
    sentimentType: "neutral",
  },
  {
    title: "Impressions",
    description: "Low",
    sentimentType: "negative",
  },
];

const AspectSection = () => {
  return (
    <Paper p={16} withBorder>
      <Title order={4} mb={8}>
        Aspect Overview
      </Title>

      <Flex w="100%" gap={16}>
        {aspectData.map((aspect, index) => (
          <AspectDashboardCard
            key={index}
            title={aspect.title}
            description={aspect.description}
            sentimentType={aspect.sentimentType}
          />
        ))}
      </Flex>
    </Paper>
  );
};

export default AspectSection;
