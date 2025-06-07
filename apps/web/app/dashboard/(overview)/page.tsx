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
    <Box p={{ base: 8, sm: 0 }}>
      <Stack gap={16}>
        <StatsCards />
        <TrendCards />
        <AspectSection />
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 12, sm: 16 }}>
          <RecentMentions />
          <Notifications />
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
