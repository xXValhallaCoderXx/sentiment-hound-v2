import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import { Box, Text, Title, Stack } from "@mantine/core"; // Removed Title, Group, Button
// import { IconListCheck } from "@tabler/icons-react"; // Unused
import JobListTable from "./components/JobListTable";
import JobListTableLoading from "./components/JobListTableLoading";
import TaskFilter from "./components/TaskFilter";
// import { integrationsService } from "@repo/services"; // Unused
import { TaskStatus, TaskType } from "@repo/db";
import JobDetailDrawer from "./components/JobDetailDrawer";

const JobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await auth();
  console.log("JOOOOBS: ", session);
  const {
    status,
    type,
    page = "1",
    pageSize = "10",
    jobId,
  } = await searchParams;

  // Convert page and pageSize to numbers
  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(pageSize, 10);

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 12, sm: 16, md: 24 }}>
      <Stack gap={24}>
        <Title order={1} fw={600}>
          Job List
        </Title>
        <Text c="dimmed">
          A list of all analysis tasks and their current status.
        </Text>

        <TaskFilter />
        <Suspense fallback={<JobListTableLoading />}>
          <JobListTable
            userId={session.user.id}
            filters={{
              status: status as TaskStatus | undefined,
              type: type as TaskType | undefined,
            }}
            pagination={{
              page: currentPage,
              pageSize: itemsPerPage,
            }}
          />
        </Suspense>
        <JobDetailDrawer jobId={jobId || ""} />
      </Stack>
    </Box>
  );
};

export default JobsPage;
