import React from 'react';
import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { sentimentToPercentage, getStatusBadgeColor } from '@/utils/sentimentUtils';
import classes from './AnalysisCard.module.css';

export interface AnalysisCardProps {
  id: string;
  title: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  overallScore: number; // -1.0 to 1.0 sentiment score
  commentCount: number;
  createdAt: Date;
  onClick?: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  status,
  overallScore,
  commentCount,
  createdAt,
  onClick,
}) => {
  // Convert sentiment score to percentage for display
  const sentimentPercentage = sentimentToPercentage(overallScore);
  
  // Get badge color for status
  const badgeColor = getStatusBadgeColor(status);

  return (
    <Card
      className={classes.card}
      padding="md"
      radius="sm"
      withBorder
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Group justify="space-between" align="flex-start">
        {/* Left content area */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Text 
            fw={500} 
            size="md" 
            lineClamp={2}
            className={classes.title}
          >
            {title}
          </Text>
          
          <Text size="xs" c="dimmed">
            Created {createdAt.toLocaleDateString()}
          </Text>
        </Stack>

        {/* Right content area */}
        <Stack gap="xs" align="flex-end" style={{ flexShrink: 0 }}>
          <Badge color={badgeColor} variant="light" size="sm">
            {status}
          </Badge>
          
          <Group gap="md" align="center">
            <div className={classes.metricGroup}>
              <Text size="xs" c="dimmed" ta="right">
                Sentiment
              </Text>
              <Text size="sm" fw={500} ta="right">
                {sentimentPercentage}%
              </Text>
            </div>
            
            <div className={classes.metricGroup}>
              <Text size="xs" c="dimmed" ta="right">
                Comments
              </Text>
              <Text size="sm" fw={500} ta="right">
                {commentCount.toLocaleString()}
              </Text>
            </div>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};

export default AnalysisCard;
