"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  Title, 
  Stack, 
  Group, 
  Button, 
  Text, 
  Badge, 
  Flex, 
  Avatar,
  Loader,
  Pagination,
  Box
} from "@mantine/core";
import { 
  IconBrandYoutube, 
  IconBrandReddit, 
  IconBrandTwitter,
  IconWorld,
  IconCircle
} from "@tabler/icons-react";
import { getRecentMentions, MentionItem } from "@/actions/dashboard.actions";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const RecentMentionsFeed = () => {
  const [mentions, setMentions] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<SentimentFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchMentions();
  }, [activeFilter, currentPage]);

  const fetchMentions = async () => {
    try {
      setLoading(true);
      const filters = {
        sentiment: activeFilter === "all" ? undefined : activeFilter.toUpperCase(),
        page: currentPage,
        pageSize,
      };
      
      const result = await getRecentMentions(filters);
      if (result.error) {
        setError(result.error.message);
      } else {
        setMentions(result.data?.mentions || []);
        setTotalPages(result.data?.totalPages || 1);
        setTotal(result.data?.total || 0);
      }
    } catch (err) {
      setError("Failed to load mentions");
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    const iconProps = { size: 16 };
    
    switch (lowerProvider) {
      case "youtube":
        return <IconBrandYoutube {...iconProps} color="#FF0000" />;
      case "reddit":
        return <IconBrandReddit {...iconProps} color="#FF4500" />;
      case "twitter":
      case "x":
        return <IconBrandTwitter {...iconProps} color="#1DA1F2" />;
      default:
        return <IconWorld {...iconProps} />;
    }
  };

  const getSentimentIndicator = (sentiment: string | null) => {
    const sentimentLower = sentiment?.toLowerCase();
    
    switch (sentimentLower) {
      case "positive":
        return <IconCircle size={12} color="teal" fill="teal" />;
      case "negative":
        return <IconCircle size={12} color="red" fill="red" />;
      case "neutral":
      default:
        return <IconCircle size={12} color="gray" fill="gray" />;
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    const sentimentLower = sentiment?.toLowerCase();
    
    switch (sentimentLower) {
      case "positive":
        return "teal";
      case "negative":
        return "red";
      case "neutral":
      default:
        return "gray";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      
      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    } catch {
      return "Recently";
    }
  };

  const filterButtons: { key: SentimentFilter; label: string; color?: string }[] = [
    { key: "all", label: "All" },
    { key: "positive", label: "Positive", color: "teal" },
    { key: "neutral", label: "Neutral", color: "gray" },
    { key: "negative", label: "Negative", color: "red" },
  ];

  return (
    <Card withBorder p={{ base: 12, sm: 16 }}>
      <Title order={4} mb={16}>
        Recent Mentions
      </Title>
      
      {/* Filter Controls */}
      <Group gap="xs" mb={16} wrap="wrap">
        {filterButtons.map((filter) => (
          <Button
            key={filter.key}
            size="xs"
            variant={activeFilter === filter.key ? "filled" : "light"}
            color={filter.color || "blue"}
            onClick={() => {
              setActiveFilter(filter.key);
              setCurrentPage(1); // Reset to first page when filtering
            }}
          >
            {filter.label}
          </Button>
        ))}
      </Group>

      {loading ? (
        <Box ta="center" py="xl">
          <Loader size="md" />
          <Text mt="md">Loading mentions...</Text>
        </Box>
      ) : error ? (
        <Box ta="center" py="xl">
          <Text c="red">Error: {error}</Text>
        </Box>
      ) : mentions.length === 0 ? (
        <Box ta="center" py="xl">
          <Text c="dimmed">No mentions found</Text>
        </Box>
      ) : (
        <>
          <Stack gap="md">
            {mentions.map((mention) => (
              <div
                key={mention.id}
                style={{
                  padding: "12px",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Group justify="space-between" align="flex-start" mb="xs" wrap="nowrap">
                  <Group gap="xs" wrap="nowrap">
                    {getProviderIcon(mention.provider)}
                    <Text size="sm" fw={500}>
                      {mention.provider}
                    </Text>
                    {getSentimentIndicator(mention.sentiment)}
                  </Group>
                  <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                    {formatTimeAgo(mention.timestamp)}
                  </Text>
                </Group>
                
                <Text size="sm" mb="xs" lineClamp={3}>
                  {mention.content}
                </Text>
                
                <Group gap="xs" wrap="wrap">
                  <Badge
                    size="xs"
                    variant="light"
                    color={getSentimentColor(mention.sentiment)}
                  >
                    {mention.sentiment || "Unknown"}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {formatTimeAgo(mention.timestamp)}
                  </Text>
                </Group>
              </div>
            ))}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" mt="lg">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
              />
            </Group>
          )}

          <Text size="xs" c="dimmed" ta="center" mt="md">
            Showing {mentions.length} of {total} mentions
          </Text>
        </>
      )}
    </Card>
  );
};

export default RecentMentionsFeed;