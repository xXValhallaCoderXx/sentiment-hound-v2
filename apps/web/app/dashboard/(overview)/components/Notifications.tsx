import DashboardNotificationCard from "@/components/molecules/DashboardNotificationCard";
import { Paper, Stack, Title } from "@mantine/core";

const Notifications = () => {
  return (
    <Paper p={{ base: 16, sm: 20 }} w="100%" withBorder radius="md" shadow="sm">
      <Stack gap={16}>
        <Title order={3} fw={600}>
          Notifications
        </Title>
        <DashboardNotificationCard
          title="New comment on your post"
          message="John Doe commented on your post: 'Great article!'"
          buttonLabel="View"
        />
        <DashboardNotificationCard
          title="New comment on your post"
          message="John Doe commented on your post: 'Great article!'"
          buttonLabel="View"
          type="success"
        />
      </Stack>
    </Paper>
  );
};
export default Notifications;
