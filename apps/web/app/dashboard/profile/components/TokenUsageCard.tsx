"use client";

import { Box, Card, Group, Progress, Stack, Text, ThemeIcon, Badge, Button } from "@mantine/core";
import { IconCoins, IconExternalLink } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { getTokenUsageStatus } from "@/actions/plan-usage.actions";

interface TokenUsageCardProps {
  userId: string;
}

interface TokenUsageData {
  current: number;
  limit: number;
  periodEnd: Date | null;
  isOverage: boolean;
  percentage: number;
}

const TokenUsageCard: FC<TokenUsageCardProps> = ({ userId }) => {
  const [tokenData, setTokenData] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenUsage = async () => {
      try {
        setLoading(true);
        const response = await getTokenUsageStatus();
        
        if (response.error) {
          console.error("Error fetching token usage:", response.error);
          setTokenData(null);
        } else {
          setTokenData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch token usage:", error);
        setTokenData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenUsage();
  }, []);

  const getProgressColor = (percentage: number, isOverage: boolean) => {
    if (isOverage) return "red";
    if (percentage >= 90) return "red";
    if (percentage >= 75) return "yellow";
    return "blue";
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k`;
    return tokens.toLocaleString();
  };

  if (loading) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">Loading token usage...</Text>
      </Card>
    );
  }

  if (!tokenData) {
    return (
      <Card withBorder>
        <Text size="sm" c="dimmed">Unable to load token usage</Text>
      </Card>
    );
  }

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="purple">
              <IconCoins size={16} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Plan & Usage</Text>
          </Group>
          <Button
            size="xs"
            variant="light"
            rightSection={<IconExternalLink size={12} />}
            onClick={() => {
              // This would link to payment provider's customer portal
              console.log("Navigate to billing portal");
            }}
          >
            Manage Billing
          </Button>
        </Group>

        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Monthly Token Allowance</Text>
            <Badge 
              size="sm" 
              variant="light" 
              color={tokenData.isOverage ? "red" : "blue"}
            >
              {formatTokens(tokenData.current)} / {formatTokens(tokenData.limit)}
            </Badge>
          </Group>
          
          <Progress
            value={Math.min(tokenData.percentage, 100)}
            color={getProgressColor(tokenData.percentage, tokenData.isOverage)}
            size="md"
            mb="xs"
          />
          
          {tokenData.isOverage && (
            <Text size="xs" c="red" mb="xs">
              ⚠️ You have exceeded your monthly allowance. Overage charges may apply.
            </Text>
          )}
          
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {tokenData.percentage.toFixed(1)}% used this month
            </Text>
            {tokenData.periodEnd && (
              <Text size="xs" c="dimmed">
                Resets on {new Date(tokenData.periodEnd).toLocaleDateString()}
              </Text>
            )}
          </Group>
        </Box>
      </Stack>
    </Card>
  );
};

export default TokenUsageCard;