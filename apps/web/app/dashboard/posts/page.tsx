import { redirect } from "next/navigation";
import { postService } from "@repo/services";
import { Suspense } from "react";
import { auth } from "@/lib/next-auth.lib";
import { Box, Flex } from "@mantine/core";
import PostListTable from "./components/PostListTable";
import LoadingList from "./components/LoadingList";
import PageLayout from "@/components/templates/PageLayout";
import PostFilter from "./components/PostFilter";

export default async function PostsDefaultPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
    providerId?: string;
    sentiment?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
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
  const sentimentFilter = sentiment || undefined;
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
    <PageLayout
      title="Social Media Posts"
      description="A list of all your social media posts and their sentiment analysis results."
    >
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
          {postsData.data.length > 0 ? (
            <PostListTable
              data={postsData.data}
              pagination={{
                page: pageFilter,
                totalPages: postsData.totalPages,
                onPageChange: (newPage) => {
                  // This will be handled by a client component
                },
              }}
            />
          ) : (
            <Flex justify="center">
              No posts found with the current filters. Try adjusting your search
              criteria.
            </Flex>
          )}
        </Box>
      </Suspense>
    </PageLayout>
  );
}
