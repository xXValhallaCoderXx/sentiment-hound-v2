import { Paper, Title, SimpleGrid } from "@mantine/core";
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
    <Paper p={{ base: 16, sm: 20, md: 24 }} withBorder radius="md" shadow="sm">
      <Title order={3} mb={20} fw={600}>
        Aspect Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 12, sm: 16 }}>
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
