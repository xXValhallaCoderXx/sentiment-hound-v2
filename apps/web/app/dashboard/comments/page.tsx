import { auth } from "@/lib/next-auth.lib";
import { Title, Group, Box, Text } from "@mantine/core";
import { commentsService } from "@repo/services";
import CommentFilters from "./components/CommentFilters";
import CommentsTable from "./components/CommentsTable";
import CommentDrawer from "./components/CommentDrawer";

const CommentsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const session = await auth();
  const {
    providerId,
    sentiment,
    aspect,
    commentId,
    page = "1",
    pageSize = "10",
  } = searchParams;

  // Convert pagination params to numbers
  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(pageSize, 10);

  const selectedComment = commentId
    ? await commentsService.getComment(parseInt(commentId))
    : null;

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  try {
    const paginatedComments = await commentsService.getUserCommentsWithFilters({
      userId: session.user.id,
      providerId: providerId ? parseInt(providerId) : undefined,
      sentiment: sentiment || undefined,
      aspect: aspect || undefined,
      page: currentPage,
      pageSize: itemsPerPage,
    });

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
        <CommentsTable
          data={paginatedComments.data}
          pagination={{
            page: paginatedComments.page,
            pageSize: paginatedComments.pageSize,
            total: paginatedComments.total,
            totalPages: paginatedComments.totalPages,
          }}
          filters={{
            providerId,
            sentiment,
            aspect,
          }}
        />
        <CommentDrawer
          opened={!!selectedComment}
          selectedComment={selectedComment}
        />
      </Box>
    );
  } catch (error) {
    console.error("Error loading comments page:", error);
    return (
      <Box p="xl" ta="center">
        <Text color="red">An error occurred while loading comments data</Text>
      </Box>
    );
  }
};

export default CommentsPage;
