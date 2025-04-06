import React from "react";
import { Box, Text, SimpleGrid, Center, Stack, Group } from "@mantine/core";
import { ProcessedPost } from "@repo/services";
import PostListItem from "@/components/molecules/PostListItem";
import PaginationControl from "./PaginationControl";

interface PostsTableProps {
  data: any;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
  };
}

const PostListTable = ({ data, pagination }: PostsTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Box p="md">
        <Text>
          No posts available. Try fetching new posts or adjusting your filters.
        </Text>
      </Box>
    );
  }

  console.log("DATA: ", data);

  // Format the data for PostListItem
  const formattedPosts = data.map((post: ProcessedPost) => {
    // Calculate the top aspects (most mentioned positive aspects)
    const positiveAspects = Object.entries(post?.aspectAnalyses?.positive || {})
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 3)
      .map(([aspect]) => aspect);

    // Calculate areas of concern (most mentioned negative aspects)
    const areasOfConcern = Object.entries(post?.aspectAnalyses?.negative || {})
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 3)
      .map(([aspect]) => aspect);

    return {
      id: post.id,
      provider: "unknown",
      postDate: new Date(post.publishedAt).toLocaleDateString(),
      commentsCount: post.comments.length,
      sentimentDistribution: {
        positive: post?.sentimentPercentages?.positive || 0,
        neutral: post?.sentimentPercentages?.neutral || 0,
        negative: post?.sentimentPercentages?.negative || 0,
      },
      topAspects: positiveAspects,
      areasOfConcern: areasOfConcern,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      postUrl: post.postUrl,
    };
  });

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1 }} spacing="md" verticalSpacing="md">
        {formattedPosts.map((post: any) => (
          <PostListItem
            key={post.id}
            provider={post.provider as any}
            postDate={post.postDate}
            commentsCount={post.commentsCount}
            sentimentDistribution={post.sentimentDistribution}
            topAspects={post.topAspects}
            areasOfConcern={post.areasOfConcern}
            title={post.title}
            imageUrl={post.imageUrl || undefined}
            postUrl={post.postUrl}
            description={post.description || undefined}
          />
        ))}
      </SimpleGrid>

      {pagination && pagination.totalPages > 1 && (
        <Center mt="lg">
          <PaginationControl
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        </Center>
      )}
    </Stack>
  );
};

export default PostListTable;
