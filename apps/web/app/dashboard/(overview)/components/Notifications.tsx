import DashboardNotificationCard from "@/components/molecules/DashboardNotificationCard";
import { Paper, Stack, Title } from "@mantine/core";

const Notifications = () => {
  return (
    <Paper p={16} w="100%" withBorder>
      <Stack>
        <Title>Notifications</Title>
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
