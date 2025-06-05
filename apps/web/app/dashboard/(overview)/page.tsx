import { Stack, Flex, Box, SimpleGrid } from "@mantine/core";
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
    <Box>
      <Stack gap={16}>
        <StatsCards />
        <TrendCards />
        <AspectSection />
        <SimpleGrid cols={{ base: 1, md: 10 }} spacing="md" mt="md">
          <Box span={{ base: 10, md: 7 }}> {/* Ensure base takes full width if stacking */}
            <RecentMentions />
          </Box>
          <Box span={{ base: 10, md: 3 }}> {/* Ensure base takes full width if stacking */}
            <Notifications />
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
