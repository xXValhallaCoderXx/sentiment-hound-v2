import { Paper, Stack, Title } from "@mantine/core";
import DashboardCommentCard from "@/components/molecules/DashboardCommentCard";

const RecentMentions = () => {
  return (
    <Paper withBorder w="100%" p={16}>
      <Title order={4}>Recent Posts</Title>
      <Stack mt={16} gap={8}>
        <DashboardCommentCard />
        <DashboardCommentCard />
        <DashboardCommentCard />
      </Stack>
    </Paper>
  );
};
export default RecentMentions;
