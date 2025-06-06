import { Stack, Box, SimpleGrid } from "@mantine/core";
import {
  OverallSentimentScore,
  SentimentTrendChart,
  RecentMentionsFeed,
} from "./components";

const DashboardPage = async () => {
  return (
    <Box p={{ base: 8, sm: 0 }}>
      <Stack gap={24}>
        {/* Component A: Overall Sentiment Score */}
        <OverallSentimentScore />
        
        {/* Component B: Sentiment Trend Chart */}
        <SentimentTrendChart />
        
        {/* Component C: Recent Mentions Feed */}
        <RecentMentionsFeed />
      </Stack>
    </Box>
  );
};

export default DashboardPage;
