import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import { Title, Group, Box, Text } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import { commentsService } from "@repo/services";
import CommentsTable from "./components/CommentsTable";

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

    const comments = await commentsService.getUserCommentsWithFilters({
      userId: session.user.id,
    });

    console.log("COMMENTS: ", comments);

    return (
      <Box p="xl">
        <Group mb="lg">
          <div>
            <Title order={2}>Comments</Title>
            <Text color="dimmed">
              View and manage comments from all your integrations
            </Text>
          </div>
        </Group>
        <CommentsTable data={comments} />
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
