"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Flex, Group, Loader } from "@mantine/core";
import { IconArrowNarrowUp, IconArrowNarrowDown, IconLine } from "@tabler/icons-react";
import { getDashboardStats, DashboardStats } from "@/actions/dashboard.actions";

const OverallSentimentScore = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        if (result.error) {
          setError(result.error.message);
        } else {
          setStats(result.data);
        }
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "teal";
    if (score >= 50) return "yellow"; 
    return "red";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Positive";
    if (score >= 50) return "Neutral";
    return "Negative";
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return <IconLine size={20} color="gray" />;
    if (change > 0) return <IconArrowNarrowUp size={20} color="teal" />;
    return <IconArrowNarrowDown size={20} color="red" />;
  };

  const getTrendText = (change?: number) => {
    if (!change) return "No change from yesterday";
    const direction = change > 0 ? "up" : "down";
    return `${Math.abs(change)} points ${direction} from yesterday`;
  };

  if (loading) {
    return (
      <Card withBorder p="xl" ta="center">
        <Loader size="md" />
        <Text mt="md">Loading sentiment score...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder p="xl" ta="center">
        <Text c="red">Error: {error}</Text>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card withBorder p="xl" ta="center">
        <Text c="dimmed">No sentiment data available</Text>
      </Card>
    );
  }

  return (
    <Card withBorder p={{ base: "md", sm: "xl" }} ta="center">
      <Group justify="center" gap="xs" mb="md">
        <Title order={3} c="dimmed" fw={500} size={{ base: "lg", sm: "xl" }}>
          Overall Sentiment Score
        </Title>
      </Group>
      
      <Title 
        order={1} 
        size={{ base: "3rem", sm: "4rem" }}
        fw={700} 
        c={getSentimentColor(stats.overallSentimentScore)}
        mb="xs"
      >
        {stats.overallSentimentScore}
      </Title>
      
      <Text 
        size={{ base: "md", sm: "lg" }} 
        fw={500} 
        c={getSentimentColor(stats.overallSentimentScore)} 
        mb="md"
      >
        {getSentimentLabel(stats.overallSentimentScore)}
      </Text>
      
      <Group justify="center" gap="xs" mb="lg">
        {getTrendIcon(stats.changeFromPrevious)}
        <Text size="sm" c="dimmed">
          {getTrendText(stats.changeFromPrevious)}
        </Text>
      </Group>

      <Group justify="center" gap={{ base: "md", sm: "xl" }} mt="xl" wrap="wrap">
        <div style={{ textAlign: "center" }}>
          <Text size={{ base: "lg", sm: "xl" }} fw={600} c="teal">
            {stats.sentimentCounts.positive}
          </Text>
          <Text size="xs" c="dimmed" tt="uppercase">
            Positive
          </Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text size={{ base: "lg", sm: "xl" }} fw={600} c="yellow">
            {stats.sentimentCounts.neutral}
          </Text>
          <Text size="xs" c="dimmed" tt="uppercase">
            Neutral
          </Text>
        </div>
        <div style={{ textAlign: "center" }}>
          <Text size={{ base: "lg", sm: "xl" }} fw={600} c="red">
            {stats.sentimentCounts.negative}
          </Text>
          <Text size="xs" c="dimmed" tt="uppercase">
            Negative
          </Text>
        </div>
      </Group>

      <Text size="sm" c="dimmed" mt="lg">
        Based on {stats.totalMentions} mentions analyzed
      </Text>
    </Card>
  );
};

export default OverallSentimentScore;