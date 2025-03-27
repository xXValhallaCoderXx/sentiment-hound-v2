import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import { Title, Group, Box, Text } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import { commentsService } from "@repo/services";
import CommentFilters from "./components/CommentFilters";
import CommentsTable from "./components/CommentsTable";

import { integrationsService } from "@repo/services";

const CommentsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  try {
    // Extract filters from query parameters
    const { providerId, sentiment, aspect } = searchParams;

    // Fetch filtered comments
    const comments = await commentsService.getUserCommentsWithFilters({
      userId: session.user.id,
      providerId: providerId ? parseInt(providerId) : undefined,
      sentiment: sentiment || undefined,
      aspect: aspect || undefined,
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
        <CommentFilters />
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

export default CommentsPage;
