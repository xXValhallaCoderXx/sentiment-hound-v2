import { Paper } from "@mantine/core";

const RecentMentions = () => {
  return (
    <Paper withBorder w="100%" p={8}>
      <h3 className="text-lg font-semibold">Recent Mentions</h3>
      <div className="flex flex-col gap-2">
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-700">
            You were mentioned in a comment on the PR #1234
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-sm text-gray-700">
            You were mentioned in a comment on the PR #5678
          </p>
        </div>
      </div>
    </Paper>
  );
};
export default RecentMentions;
