import { Paper, SimpleGrid, Title } from "@mantine/core";
import DashboardSentimentCard from "@/components/molecules/DashboardSentimentCard";

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
    <Paper p={{ base: 12, sm: 16 }} withBorder>
      <Title order={4} mb={8}>
        Aspect Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
        {aspectData.map((aspect, index) => (
          <DashboardSentimentCard
            key={index}
            title={aspect.title}
            description={aspect.description}
            sentimentType={aspect.sentimentType}
          />
        ))}
      </SimpleGrid>
    </Paper>
  );
};

export default AspectSection;
