import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import { Box, Title, Text, Group, Button } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import JobListTable from "./components/JobListTable";
import JobListTableLoading from "./components/JobListTableLoading";
import TaskFilter from "./components/TaskFilter";
import { integrationsService } from "@repo/services";
import { TaskStatus, TaskType } from "@repo/db";
import PageLayout from "@/components/templates/PageLayout";
import JobDetailDrawer from "./components/JobDetailDrawer";

const JobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await auth();
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
  console.log("JOB ID", jobId);
  return (
    <PageLayout
      title="Job List"
      description=" A list of all analysis tasks and their current status."
    >
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
    </PageLayout>
  );
};

export default JobsPage;
