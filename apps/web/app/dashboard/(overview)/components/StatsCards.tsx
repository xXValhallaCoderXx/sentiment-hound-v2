import { SimpleGrid } from "@mantine/core";
import DashboardSentimentCard, {
  IDashboardSentimentCardProps,
} from "@/components/molecules/DashboardSentimentCard";

const data: IDashboardSentimentCardProps[] = [
  { title: "Positive", description: "1000", sentimentType: "positive" },
  { title: "Negative", description: "200", sentimentType: "negative" },
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
