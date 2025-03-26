"use client";
import { Post } from "@repo/db";
import React from "react";
import {
  Box,
  Table,
  Text,
  Progress,
  Group,
  Avatar,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";

interface PostWithSentiment extends Post {
  comments: Comment[];
}

interface PostsTableProps {
  data: PostWithSentiment[];
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
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Post</Table.Th>
            <Table.Th>Published</Table.Th>
            <Table.Th>Comments</Table.Th>
            <Table.Th>Sentiment Overview</Table.Th>
            <Table.Th>Top Aspects</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((post) => {
            // Calculate sentiment stats
            const sentimentCounts = post.comments.reduce(
              (acc, comment) => {
                if (comment.sentiment === "POSITIVE") acc.positive++;
                else if (comment.sentiment === "NEGATIVE") acc.negative++;
                else acc.neutral++;
                return acc;
              },
              { positive: 0, neutral: 0, negative: 0 }
            );

            // Calculate percentages
            const total = post.comments.length || 1;
            const positivePercent = Math.round(
              (sentimentCounts.positive / total) * 100
            );
            const negativePercent = Math.round(
              (sentimentCounts.negative / total) * 100
            );
            const neutralPercent = 100 - positivePercent - negativePercent;

            // Extract top aspects
            const aspects = post.comments
              .flatMap((comment) => comment.aspectAnalyses || [])
              .reduce(
                (acc, aspect) => {
                  acc[aspect.aspect] = acc[aspect.aspect] || {
                    count: 0,
                    positive: 0,
                    negative: 0,
                  };
                  acc[aspect.aspect].count++;
                  acc[aspect.aspect][aspect.sentiment.toLowerCase()]++;
                  return acc;
                },
                {} as Record<
                  string,
                  { count: number; positive: number; negative: number }
                >
              );

            const topAspects = Object.entries(aspects)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 3);

            return (
              <Table.Tr key={post.id}>
                <Table.Td>
                  <Group>
                    {post.imageUrl && (
                      <Avatar src={post.imageUrl} size="md" radius="sm" />
                    )}
                    <div>
                      <Text size="sm" fw={500}>
                        {post.title}
                      </Text>
                      {post.description && (
                        <Text size="xs" color="dimmed" lineClamp={1}>
                          {post.description}
                        </Text>
                      )}
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge>{post.comments.length}</Badge>
                </Table.Td>
                <Table.Td>
                  <Box>
                    <Group position="apart" mb={5}>
                      <Text size="xs" color="green">
                        Positive: {positivePercent}%
                      </Text>
                      <Text size="xs" color="red">
                        Negative: {negativePercent}%
                      </Text>
                    </Group>
                    <Progress
                      sections={[
                        { value: positivePercent, color: "green" },
                        { value: neutralPercent, color: "gray" },
                        { value: negativePercent, color: "red" },
                      ]}
                    />
                  </Box>
                </Table.Td>
                <Table.Td>
                  {topAspects.length > 0 ? (
                    <Group spacing={4} direction="column">
                      {topAspects.map(([aspect, stats]) => (
                        <Badge
                          key={aspect}
                          color={
                            stats.positive > stats.negative ? "green" : "red"
                          }
                          variant="light"
                          size="sm"
                        >
                          {aspect}
                        </Badge>
                      ))}
                    </Group>
                  ) : (
                    <Text size="xs" color="dimmed">
                      No aspects analyzed
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Link
                    href={`/dashboard/posts/${post?.integration?.provider?.name}/${post.id}`}
                    passHref
                  >
                    <ActionIcon variant="subtle">
                      <IconEye size={16} />
                    </ActionIcon>
                  </Link>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default PostListTable;
