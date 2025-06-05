import { Stack, Box, SimpleGrid } from "@mantine/core";
import {
  StatsCards,
  RecentMentions,
  TrendCards,
  Notifications,
  AspectSection,
} from "./components";
// import { postService } from "services";

const DashboardPage = async () => {
  // const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;
  // const posts = await postService.getPosts({ page: 1, limit: 10 });

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
