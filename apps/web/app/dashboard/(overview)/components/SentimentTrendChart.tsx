"use client";

import { useState, useEffect } from "react";
import { Card, Title, Loader, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { getSentimentTrend, getUserPlanInfo, TrendDataPoint } from "@/actions/dashboard.actions";

const SentimentTrendChart = () => {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<{ planName: string; lookbackPeriod: "7days" | "30days" | "90days" } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user plan info first
        const planResult = await getUserPlanInfo();
        if (planResult.error) {
          setError(planResult.error.message);
          return;
        }
        
        setPlanInfo(planResult.data);
        
        // Then get trend data based on user's plan
        const trendResult = await getSentimentTrend(planResult.data?.lookbackPeriod);
        if (trendResult.error) {
          setError(trendResult.error.message);
        } else {
          setTrendData(trendResult.data || []);
        }
      } catch (err) {
        setError("Failed to load trend data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPeriodLabel = (lookbackPeriod: string) => {
    switch (lookbackPeriod) {
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

  const getPlanFeatureText = (planName: string, lookbackPeriod: string) => {
    const periodLabel = getPeriodLabel(lookbackPeriod);
    return `${periodLabel} history (${planName} plan)`;
  };

  if (loading) {
    return (
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={16}>
          Sentiment Trend
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
          Sentiment Trend
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
          Sentiment Trend
        </Title>
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Text c="dimmed">No trend data available</Text>
          {planInfo && (
            <Text size="xs" c="dimmed" mt="xs">
              {getPlanFeatureText(planInfo.planName, planInfo.lookbackPeriod)}
            </Text>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card withBorder p={{ base: 12, sm: 16 }}>
      <Title order={4} mb={8}>
        Sentiment Trend
      </Title>
      {planInfo && (
        <Text size="sm" c="dimmed" mb={16}>
          {getPlanFeatureText(planInfo.planName, planInfo.lookbackPeriod)}
        </Text>
      )}
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