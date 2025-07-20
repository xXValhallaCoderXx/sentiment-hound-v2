"use client";

import {
  Box,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconKeyboard,
  IconPlug,
  IconCoins,
} from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { getPlanUsageStats } from "@/actions/plan-usage.actions";

interface PlanUsageStatsProps {
  userId?: string;
}

interface UsageStats {
  integrations: { current: number; max: number };
  trackedKeywords: { current: number; max: number };
  tokens: { current: number; max: number; periodEnd: Date | null };
}

const PlanUsageStats: FC<PlanUsageStatsProps> = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getPlanUsageStats();

        if (response.error) {
          console.error("Error fetching plan usage stats:", response.error);
          setStats(null);
        } else {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch usage stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">
          Loading usage statistics...
        </Text>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">
          Unable to load usage statistics
        </Text>
      </Card>
    );
  }

  const getProgressColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "red";
    if (percentage >= 75) return "yellow";
    return "blue";
  };

  const formatLimit = (max: number) => {
    if (max === -1) return "Unlimited";
    if (max >= 1000000) return `${(max / 1000000).toFixed(1)}M`;
    if (max >= 1000) return `${(max / 1000).toFixed(0)}k`;
    return max.toString();
  };

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconTrendingUp size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            Plan Usage
          </Text>
        </Group>

        <Stack gap="sm">
          {/* Integrations Usage */}
          <Box>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon size="xs" variant="light" color="green">
                  <IconPlug size={10} />
                </ThemeIcon>
                <Text size="sm">Integrations</Text>
              </Group>
              <Badge size="sm" variant="light">
                {stats.integrations.current} /{" "}
                {formatLimit(stats.integrations.max)}
              </Badge>
            </Group>
            {stats.integrations.max > 0 && (
              <Progress
                value={
                  (stats.integrations.current / stats.integrations.max) * 100
                }
                color={getProgressColor(
                  stats.integrations.current,
                  stats.integrations.max,
                )}
                size="sm"
              />
            )}
          </Box>

          {/* Tracked Keywords Usage */}
          <Box>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon size="xs" variant="light" color="orange">
                  <IconKeyboard size={10} />
                </ThemeIcon>
                <Text size="sm">Tracked Keywords</Text>
              </Group>
              <Badge size="sm" variant="light">
                {stats.trackedKeywords.current} /{" "}
                {formatLimit(stats.trackedKeywords.max)}
              </Badge>
            </Group>
            {stats.trackedKeywords.max > 0 && (
              <Progress
                value={
                  (stats.trackedKeywords.current / stats.trackedKeywords.max) *
                  100
                }
                color={getProgressColor(
                  stats.trackedKeywords.current,
                  stats.trackedKeywords.max,
                )}
                size="sm"
              />
            )}
          </Box>

          {/* Token Usage */}
          <Box>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon size="xs" variant="light" color="purple">
                  <IconCoins size={10} />
                </ThemeIcon>
                <Text size="sm">Monthly Tokens</Text>
              </Group>
              <Badge size="sm" variant="light">
                {stats.tokens.current.toLocaleString()} /{" "}
                {formatLimit(stats.tokens.max)}
              </Badge>
            </Group>
            {stats.tokens.max > 0 && (
              <Progress
                value={(stats.tokens.current / stats.tokens.max) * 100}
                color={getProgressColor(stats.tokens.current, stats.tokens.max)}
                size="sm"
              />
            )}
            {stats.tokens.periodEnd && (
              <Text size="xs" c="dimmed" mt="xs">
                Resets on{" "}
                {new Date(stats.tokens.periodEnd).toLocaleDateString()}
              </Text>
            )}
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PlanUsageStats;
