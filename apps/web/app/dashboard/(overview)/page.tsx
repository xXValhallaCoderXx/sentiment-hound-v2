import { Stack, Flex, Box } from "@mantine/core";
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
        <Flex gap={16}>
          <Flex w="70%">
            <RecentMentions />
          </Flex>
          <Flex w="30%">
            <Notifications />
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
