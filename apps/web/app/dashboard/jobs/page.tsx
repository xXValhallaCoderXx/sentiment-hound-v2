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

const JobsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const session = await auth();
  const { status, type, page = "1", pageSize = "10" } = await searchParams;

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

  //   if (integrations.length === 0) {
  //     return (
  //       <Box p="xl">
  //         <Group mb="lg">
  //           <div>
  //             <Title order={2}>Jobs</Title>
  //             <Text color="dimmed">
  //               Track content fetching and analysis tasks
  //             </Text>
  //           </div>
  //         </Group>

  //         <Box py="xl" ta="center">
  //           <IconListCheck size={64} color="gray" opacity={0.3} />
  //           <Title order={3} mt="md">
  //             No Integrations Found
  //           </Title>
  //           <Text color="dimmed" maw={500} mx="auto" mt="sm" mb="xl">
  //             You need to integrate a social media account before you can see
  //             any jobs.
  //           </Text>
  //           <Button component="a" href="/dashboard/integrations">
  //             Connect an Account
  //           </Button>
  //         </Box>
  //       </Box>
  //     );
  //   }

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
    </PageLayout>
  );
};

export default JobsPage;
