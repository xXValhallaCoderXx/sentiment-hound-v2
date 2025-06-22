import { Stack, Box, SimpleGrid } from "@mantine/core";
import {
  StatsCards,
  RecentMentions,
  TrendCards,
  Notifications,
  AspectSection,
} from "./components";

const DashboardPage = async () => {
  return (
    <Box p={{ base: 12, sm: 16, md: 24 }}>
      <Stack gap={24}>
        <StatsCards />
        <TrendCards />
        <AspectSection />
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={20}>
          <RecentMentions />
          <Notifications />
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
