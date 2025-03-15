"use client";
import React from "react";
import {
  Box,
  Table,
  Text,
  Checkbox,
  Group,
  Avatar,
  Badge,
} from "@mantine/core";

interface Post {
  id: string;
  title: string;
  content?: string;
  thumbnailUrl?: string;
  publishDate?: Date;
  likes?: number;
  comments?: number;
  views?: number;
  status?: string;
}

interface PostListTableProps {
  data: Post[];
}

const PostListTable = ({ data }: PostListTableProps) => {
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
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>
              <Checkbox />
            </Table.Th>
            <Table.Th>Post</Table.Th>
            <Table.Th>Published</Table.Th>
            <Table.Th>Engagement</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((post) => (
            <Table.Tr key={post.id}>
              <Table.Td>
                <Checkbox />
              </Table.Td>
              <Table.Td>
                <Group>
                  {post.thumbnailUrl && (
                    <Avatar src={post.thumbnailUrl} size="md" radius="sm" />
                  )}
                  <div>
                    <Text size="sm" fw={500}>
                      {post.title}
                    </Text>
                    {post.content && (
                      <Text size="xs" color="dimmed" lineClamp={1}>
                        {post.content}
                      </Text>
                    )}
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>
                {post.publishDate ? (
                  <Text size="sm">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </Text>
                ) : (
                  <Text size="sm" color="dimmed">
                    -
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {post.likes !== undefined && (
                    <Text size="xs">👍 {post.likes}</Text>
                  )}
                  {post.comments !== undefined && (
                    <Text size="xs">💬 {post.comments}</Text>
                  )}
                  {post.views !== undefined && (
                    <Text size="xs">👁️ {post.views}</Text>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={
                    post.status === "analysed"
                      ? "green"
                      : post.status === "pending"
                        ? "yellow"
                        : "gray"
                  }
                >
                  {post.status || "Not analysed"}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default PostListTable;
