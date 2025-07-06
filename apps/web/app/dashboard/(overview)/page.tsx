import { Stack, Box, SimpleGrid, Group, Title, Text } from "@mantine/core";
import {
  StatsCards,
  RecentMentions,
  TrendCards,
  Notifications,
  AspectSection,
  AnalyzeButton,
} from "./components";

const DashboardPage = async () => {
  return (
    <Box p={{ base: 12, sm: 16, md: 24 }}>
      <Stack gap={24}>
        {/* Dashboard Header with Analyze Button */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box>
            <Title order={1} size="h2" mb={4}>
              Dashboard
            </Title>
            <Text c="dimmed" size="lg">
              Monitor sentiment and engagement across your content
            </Text>
          </Box>
          <AnalyzeButton />
        </Group>

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
