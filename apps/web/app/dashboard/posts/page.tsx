import { postService, ProcessedPost } from "@repo/services";
import { Suspense } from "react";
import { auth } from "@/lib/next-auth.lib";
import { Box, Flex, Title, Text, Stack } from "@mantine/core";
import PostListTable from "./components/PostListTable";
import LoadingList from "./components/LoadingList";
import PostFilter from "./components/PostFilter";

export default async function PostsDefaultPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Get the current authenticated user
  const session = await auth();
  if (!session?.user?.id) {
    return <Box>You must be logged in to view this page</Box>;
  }
  const {
    page,
    pageSize,
    providerId,
    sentiment,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    searchTerm,
  } = await searchParams;
  // Get pagination parameters from URL
  const pageFilter = parseInt(page || "1", 10);
  const pageSizeFilter = parseInt(pageSize || "9", 10);

  // Get filter parameters
  const providerIdFilter = providerId ? parseInt(providerId) : undefined;
  const startDateFilter = startDate ? new Date(startDate) : undefined;
  const endDateFilter = endDate ? new Date(endDate) : undefined;
  const searchTermFilter = searchTerm || undefined;
  const sortByFilter = sortBy || "createdAt";
  const sortOrderFilter = sortOrder || "desc";

  // Get posts with filters and pagination
  const postsData = await postService.getUserProcessedPosts({
    userId: session.user.id,
    includeComments: true,
    includeAspectAnalyses: true,
    page: pageFilter,
    pageSize: pageSizeFilter,
    providerId: providerIdFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    searchTerm: searchTermFilter,
    sortBy: sortByFilter,
    sortOrder: sortOrderFilter as "asc" | "desc",
    onlyWithComments: true,
  });

  return (
    <Box p={{ base: 12, sm: 16, md: 24 }}>
      <Stack gap={24}>
        <Title order={1} fw={600}>
          Social Media Posts
        </Title>
        <Text c="dimmed">
          A list of all your social media posts and their sentiment analysis
          results.
        </Text>

        <Suspense fallback={<LoadingList />}>
          <Box p={16}>
            <Box mb={16}>
              <PostFilter
                currentFilters={{
                  providerId: providerId?.toString(),
                  sentiment,
                  startDate: startDateFilter?.toISOString().split("T")[0],
                  endDate: endDateFilter?.toISOString().split("T")[0],
                  searchTerm,
                  sortBy,
                  sortOrder,
                }}
              />
            </Box>
            {postsData?.data?.length > 0 ? (
              <PostListTable
                data={postsData?.data as ProcessedPost[]}
                pagination={{
                  page: pageFilter,
                  totalPages: postsData.totalPages || 0,
                  onPageChange: () => {
                    // This will be handled by a client component
                  },
                }}
              />
            ) : (
              <Flex justify="center">
                No posts found with the current filters. Try adjusting your
                search criteria.
              </Flex>
            )}
          </Box>
        </Suspense>
      </Stack>
    </Box>
  );
}
