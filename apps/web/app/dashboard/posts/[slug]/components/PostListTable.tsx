import React from "react";
import {
  Box,
  Table,
  Tooltip,
  Text,
  Avatar,
  Badge,
  TableTr,
  TableTd,
  TableTbody,
  TableThead,
  TableTh,
  Flex,
  Stack,
  Button,
} from "@mantine/core";

import { ProcessedPost } from "@repo/services";

interface PostsTableProps {
  data: ProcessedPost[];
}

const PostListTable = ({ data }: PostsTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Box p="md">
        <Text>No posts available. Try fetching new posts.</Text>
      </Box>
    );
  }

  return (
    <Box className="mt-4">
      <Table striped highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>Post</TableTh>
            <TableTh>Published</TableTh>
            <TableTh>Comments</TableTh>
            <TableTh>Sentiment Overview</TableTh>
            <TableTh>Top Aspects</TableTh>
            <TableTh>Actions</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {data.map((post) => {
            return (
              <TableTr key={post.id}>
                <TableTd maw={300}>
                  <Flex gap={8} maw={300}>
                    <Avatar src={post?.imageUrl} size="md" radius="sm" />
                    <Stack gap={2} maw={300}>
                      <Text size="sm" fw={500}>
                        {post.title}
                      </Text>
                      <Text size="xs" color="dimmed" truncate="end">
                        {post.description}
                      </Text>
                    </Stack>
                  </Flex>
                </TableTd>
                <TableTd>
                  <Text size="sm">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </Text>
                </TableTd>
                <TableTd>
                  <Badge>{post.comments.length}</Badge>
                </TableTd>
                <TableTd>
                  <Box>
                    <Stack gap={4}>
                      <Text size="xs" color="green">
                        Positive: {post?.sentimentCounts?.positive}%
                      </Text>
                      <Text size="xs" color="red">
                        Negative: {post?.sentimentCounts?.negative}%
                      </Text>
                      <Text size="xs" color="gray">
                        Neutral: {post?.sentimentCounts?.neutral}%
                      </Text>
                    </Stack>
                  </Box>
                </TableTd>
                <TableTd>
                  <Stack gap={4}>
                    <Tooltip
                      withArrow
                      label={Object.keys(post?.aspectAnalyses?.positive)?.join(
                        ", "
                      )}
                    >
                      <Badge color="green" variant="light" size="sm">
                        Positive -{" "}
                        {Object.keys(post?.aspectAnalyses?.positive)?.length}
                      </Badge>
                    </Tooltip>
                    <Badge color="red" variant="light" size="sm">
                      Negative -{" "}
                      {Object.keys(post?.aspectAnalyses?.negative)?.length || 0}
                    </Badge>
                    <Badge color="gray" variant="light" size="sm">
                      Neutral -{" "}
                      {Object.keys(post?.aspectAnalyses?.neutral)?.length || 0}
                    </Badge>
                  </Stack>
                </TableTd>
                <TableTd>
                  <Button size="xs">Something</Button>
                </TableTd>
              </TableTr>
            );
          })}
        </TableTbody>
      </Table>
    </Box>
  );
};

export default PostListTable;
