import { SimpleGrid } from "@mantine/core";
import DashboardSentimentCard, {
  IDashboardSentimentCardProps,
} from "@/components/molecules/DashboardSentimentCard";
import { IconMessage } from "@tabler/icons-react";

const data: IDashboardSentimentCardProps[] = [
  {
    title: "Overall Sentiment",
    description: "726",
    sentimentType: "positive",
  },
  {
    title: "Total Comments Analyzed",
    description: "1123",
    sentimentType: "negative",
  },
  { title: "Neutral", description: "500", sentimentType: "neutral" },
  { title: "N/A", description: "0" },
];

const StatsCards = () => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 4 }}>
      {data?.map((item, index) => (
        <DashboardSentimentCard key={index} {...item} />
      ))}
    </SimpleGrid>
  );
};

export default StatsCards;
