"use client";

import { useState, useEffect } from "react";
import { Card, Title, Loader, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { getSentimentTrend, TrendDataPoint } from "@/actions/dashboard.actions";

interface SentimentTrendChartProps {
  period?: "7days" | "30days" | "90days";
}

const SentimentTrendChart = ({ period = "30days" }: SentimentTrendChartProps) => {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const result = await getSentimentTrend(period);
        if (result.error) {
          setError(result.error.message);
        } else {
          setTrendData(result.data || []);
        }
      } catch (err) {
        setError("Failed to load trend data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [period]);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7days":
        return "7 Days";
      case "30days":
        return "30 Days";
      case "90days":
        return "90+ Days";
      default:
        return "30 Days";
    }
  };

  if (loading) {
    return (
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={16}>
          Sentiment Trend - {getPeriodLabel(period)}
        </Title>
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Loader size="md" />
          <Text mt="md">Loading trend data...</Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={16}>
          Sentiment Trend - {getPeriodLabel(period)}
        </Title>
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Text c="red">Error: {error}</Text>
        </div>
      </Card>
    );
  }

  if (trendData.length === 0) {
    return (
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={16}>
          Sentiment Trend - {getPeriodLabel(period)}
        </Title>
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Text c="dimmed">No trend data available</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card withBorder p={{ base: 12, sm: 16 }}>
      <Title order={4} mb={16}>
        Sentiment Trend - {getPeriodLabel(period)}
      </Title>
      <LineChart
        h={300}
        data={trendData}
        withLegend
        dataKey="date"
        series={[
          { 
            name: "overall", 
            color: "blue.6",
            label: "Overall Score"
          }
        ]}
        curveType="monotone"
        gridAxis="xy"
        withXAxis
        withYAxis
        yAxisProps={{
          domain: [0, 100],
          tickCount: 6,
        }}
        xAxisProps={{
          angle: -45,
          textAnchor: "end",
          height: 80,
        }}
      />
      <Text size="xs" c="dimmed" mt="xs" ta="center">
        Sentiment score ranges from 0 (very negative) to 100 (very positive)
      </Text>
    </Card>
  );
};

export default SentimentTrendChart;