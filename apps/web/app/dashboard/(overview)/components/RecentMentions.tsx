import { Paper, Stack, Title } from "@mantine/core";
import DashboardCommentCard from "@/components/molecules/DashboardCommentCard";

const RecentMentions = () => {
  return (
    <Paper withBorder w="100%" p={{ base: 16, sm: 20 }} radius="md" shadow="sm">
      <Title order={3} mb={20} fw={600}>
        Recent Posts
      </Title>
      <Stack gap={12}>
        <DashboardCommentCard />
        <DashboardCommentCard />
        <DashboardCommentCard />
      </Stack>
    </Paper>
  );
};
export default RecentMentions;
