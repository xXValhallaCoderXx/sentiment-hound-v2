import { FC } from "react";
import {
  Box,
  Badge,
  Stack,
  Group,
  Text,
  Divider,
  Progress,
} from "@mantine/core";
import dayjs from "dayjs";
import { prisma, TaskStatus, SubTaskMentionStatus } from "@repo/db";

interface JobDetailProps {
  jobId: string;
}

// Removed MentionStatus type alias, will use SubTaskMentionStatus from prisma

interface SubTaskMention {
  status: SubTaskMentionStatus;
}

interface SubTaskWithMentions {
  subTaskMentions: SubTaskMention[];
}

function getSubTaskStatusSummary(subTask: SubTaskWithMentions) {
  const counts: Record<SubTaskMentionStatus, number> = {
    COMPLETED: 0,
    PENDING: 0,
    FAILED: 0,
    IN_PROGRESS: 0,
  };

  subTask.subTaskMentions.forEach((c: SubTaskMention) => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  const total = subTask.subTaskMentions.length;
  const completed = counts.COMPLETED;

  return {
    ...counts,
    total,
    percentComplete: Math.round((completed / total) * 100),
  };
}

const JobDetail: FC<JobDetailProps> = async ({ jobId }) => {
  if (!jobId) return null;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(jobId) },
    include: {
      integration: {
        include: {
          provider: true,
        },
      },
      subTasks: {
        include: {
          subTaskMentions: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  });

  if (!task) return null;

  return (
    <Stack>
      <Group justify="space-between">
        <Text fw={600}>{formatEnumValue(task.type)}</Text>
        <Badge color={getStatusColor(task.status as TaskStatus)}>
          {task.status}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Started: {dayjs(new Date(task.createdAt)).format("DD/MM/YYYY")}
      </Text>
      <Text size="sm" c="dimmed">
        Updated: {dayjs(new Date(task.updatedAt)).format("DD/MM/YYYY")}
      </Text>
      <Divider my="md" />

      {task.subTasks.map((sub) => {
        const summary = getSubTaskStatusSummary(sub);
        return (
          <Box key={sub.id} mb="md">
            <Text fw={500}>{formatEnumValue(sub.type)}</Text>
            <Progress value={summary.percentComplete} />
            <Text size="xs" c="dimmed">
              {summary.COMPLETED} / {summary.total} completed
            </Text>
          </Box>
        );
      })}
    </Stack>
  );
};

function formatEnumValue(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getStatusColor(status: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "FAILED":
      return "red";
    case "IN_PROGRESS":
      return "blue";
    case "PENDING":
    default:
      return "gray";
  }
}

export default JobDetail;
