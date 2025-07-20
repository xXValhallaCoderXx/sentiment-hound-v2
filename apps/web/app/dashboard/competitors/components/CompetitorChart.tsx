"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Title,
  Select,
  Group,
  Text,
  Stack,
  Alert,
  Skeleton,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { IconInfoCircle } from "@tabler/icons-react";

interface Competitor {
  value: string;
  label: string;
}

interface CompetitorChartProps {
  userId: string;
}

const CompetitorChart = ({ userId }: CompetitorChartProps) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(
    null,
  );
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [chartData, setChartData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    try {
      // Mock data for the chart - this would be real API data
      const mockData = generateMockChartData();
      setChartData(mockData);
    } catch {
      setError("Failed to load chart data");
    }
  }, []);

  useEffect(() => {
    fetchCompetitors();
  }, [userId]);

  useEffect(() => {
    if (selectedCompetitor) {
      fetchChartData();
    }
  }, [selectedCompetitor, fetchChartData]);

  const fetchCompetitors = async () => {
    try {
      // This would be an API call in a real implementation
      // For now, we'll use mock data
      const mockCompetitors = [
        { value: "1", label: "Apple Inc." },
        { value: "2", label: "Samsung" },
        { value: "3", label: "Google" },
      ];

      setCompetitors(mockCompetitors);
      if (mockCompetitors.length > 0 && mockCompetitors[0]) {
        setSelectedCompetitor(mockCompetitors[0].value);
      }
    } catch {
      setError("Failed to load competitors");
    } finally {
      setLoading(false);
    }
  };

  const generateMockChartData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        "Your Brand": Math.random() * 2 - 1, // Random between -1 and 1
        Competitor: Math.random() * 2 - 1,
      });
    }

    return data;
  };

  if (loading) {
    return (
      <Card withBorder p="md">
        <Stack gap="md">
          <Skeleton height={32} width={200} />
          <Skeleton height={300} />
        </Stack>
      </Card>
    );
  }

  if (competitors.length === 0) {
    return (
      <Card withBorder p="md">
        <Title order={3} mb="md">
          Sentiment Comparison
        </Title>
        <Alert variant="light" color="blue" icon={<IconInfoCircle size={16} />}>
          Add competitors to see sentiment comparison charts.
        </Alert>
      </Card>
    );
  }

  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={3}>Sentiment Comparison</Title>
        <Select
          placeholder="Select competitor"
          data={competitors}
          value={selectedCompetitor}
          onChange={setSelectedCompetitor}
          style={{ minWidth: 200 }}
        />
      </Group>

      {error && (
        <Alert
          variant="light"
          color="red"
          mb="md"
          icon={<IconInfoCircle size={16} />}
        >
          {error}
        </Alert>
      )}

      <Text size="sm" c="dimmed" mb="lg">
        Compare your brand&apos;s sentiment against your selected competitor
        over the last 30 days. Data is collected from YouTube, Reddit, Facebook,
        Instagram, and other platforms.
      </Text>

      {chartData.length > 0 && (
        <LineChart
          h={300}
          data={chartData}
          dataKey="date"
          series={[
            { name: "Your Brand", color: "blue.6" },
            { name: "Competitor", color: "red.6" },
          ]}
          curveType="linear"
          withLegend
          withDots={false}
          yAxisProps={{
            domain: [-1, 1],
            tickFormatter: (value: number) => value.toFixed(1),
          }}
        />
      )}

      <Group justify="space-between" mt="md">
        <Group gap="xs">
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#228be6",
              borderRadius: 2,
            }}
          />
          <Text size="sm">Your Brand</Text>
        </Group>
        <Group gap="xs">
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#fa5252",
              borderRadius: 2,
            }}
          />
          <Text size="sm">Competitor</Text>
        </Group>
      </Group>
    </Card>
  );
};

export default CompetitorChart;
