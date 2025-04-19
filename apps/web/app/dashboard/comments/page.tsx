import { auth } from "@/lib/next-auth.lib";
import { Title, Group, Box, Text } from "@mantine/core";
import { mentionService } from "@repo/services";
import CommentFilters from "./components/CommentFilters";
import CommentsTable from "./components/CommentsTable";
import CommentDrawer from "./components/CommentDrawer";

const CommentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth();
  const {
    providerId,
    sentiment,
    aspect,
    commentId,
    page = "1",
    pageSize = "10",
  } = await searchParams;

  // Convert pagination params to numbers
  const currentPage = parseInt(String(page), 10);
  const itemsPerPage = parseInt(String(pageSize), 10);

  const selectedComment = commentId
    ? await mentionService.getComment(parseInt(String(commentId)))
    : null;

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  try {
    const paginatedComments = await mentionService.getUserCommentsWithFilters({
      userId: session.user.id,
      providerId: providerId ? parseInt(String(providerId)) : undefined,
      sentiment: String(sentiment) || undefined,
      aspect: String(aspect) || undefined,
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
            providerId: String(providerId),
            sentiment: String(sentiment),
            aspect: String(aspect),
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
