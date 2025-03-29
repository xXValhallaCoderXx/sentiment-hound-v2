import { Paper } from "@mantine/core";

const Notifications = () => {
  return (
    <Paper p={16} withBorder>
      <h2 className="text-2xl font-bold">Notifications</h2>
      <div className="flex flex-col gap-2">
        <p className="text-gray-500">No notifications yet.</p>
      </div>
    </Paper>
  );
};
export default Notifications;
