import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import { Box, Title, Text, Group, Button } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import JobListTable from "./components/JobListTable";
import JobListTableLoading from "./components/JobListTableLoading";
import { integrationsService } from "@repo/services";

const JobsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  try {
    // Check if user has any integrations
    const integrations = await integrationsService.getUserIntegrations(
      session.user.id
    );

    if (integrations.length === 0) {
      return (
        <Box p="xl">
          <Group position="apart" mb="lg">
            <div>
              <Title order={2}>Jobs</Title>
              <Text color="dimmed">
                Track content fetching and analysis tasks
              </Text>
            </div>
          </Group>

          <Box py="xl" ta="center">
            <IconListCheck size={64} color="gray" opacity={0.3} />
            <Title order={3} mt="md">
              No Integrations Found
            </Title>
            <Text color="dimmed" maw={500} mx="auto" mt="sm" mb="xl">
              You need to integrate a social media account before you can see
              any jobs.
            </Text>
            <Button component="a" href="/dashboard/integrations">
              Connect an Account
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box p="xl">
        <Group position="apart" mb="lg">
          <div>
            <Title order={2}>Jobs</Title>
            <Text color="dimmed">
              Track content fetching and analysis tasks
            </Text>
          </div>
        </Group>

        <Suspense fallback={<JobListTableLoading />}>
          <JobListTable userId={session.user.id} />
        </Suspense>
      </Box>
    );
  } catch (error) {
    console.error("Error loading jobs page:", error);
    return (
      <Box p="xl" ta="center">
        <Text color="red">An error occurred while loading jobs data</Text>
      </Box>
    );
  }
};

export default JobsPage;
