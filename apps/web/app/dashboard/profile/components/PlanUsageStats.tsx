"use client";

import { Box, Card, Group, Progress, Stack, Text, ThemeIcon, Badge } from "@mantine/core";
import { IconTrendingUp, IconKeyboard, IconPlug } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";

interface PlanUsageStatsProps {
  userId: string;
}

interface UsageStats {
  integrations: { current: number; max: number };
  trackedKeywords: { current: number; max: number };
}

const PlanUsageStats: FC<PlanUsageStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call to get usage stats
    const fetchStats = async () => {
      try {
        // Placeholder - would call planService.getPlanUsageStats(userId)
        // For now, just show mock data
        setStats({
          integrations: { current: 2, max: 3 },
          trackedKeywords: { current: 5, max: 10 }
        });
      } catch (error) {
        console.error("Failed to fetch usage stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">Loading usage statistics...</Text>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">Unable to load usage statistics</Text>
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
    return max === -1 ? "Unlimited" : max.toString();
  };

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconTrendingUp size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>Plan Usage</Text>
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
                {stats.integrations.current} / {formatLimit(stats.integrations.max)}
              </Badge>
            </Group>
            {stats.integrations.max > 0 && (
              <Progress
                value={(stats.integrations.current / stats.integrations.max) * 100}
                color={getProgressColor(stats.integrations.current, stats.integrations.max)}
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
                {stats.trackedKeywords.current} / {formatLimit(stats.trackedKeywords.max)}
              </Badge>
            </Group>
            {stats.trackedKeywords.max > 0 && (
              <Progress
                value={(stats.trackedKeywords.current / stats.trackedKeywords.max) * 100}
                color={getProgressColor(stats.trackedKeywords.current, stats.trackedKeywords.max)}
                size="sm"
              />
            )}
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PlanUsageStats;