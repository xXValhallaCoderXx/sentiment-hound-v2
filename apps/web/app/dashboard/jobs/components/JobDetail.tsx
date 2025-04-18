import { FC } from "react";
import {
  Flex,
  Box,
  Title,
  Badge,
  Stack,
  Group,
  Text,
  Divider,
  Progress,
} from "@mantine/core";
import dayjs from "dayjs";
import { prisma } from "@repo/db";
interface JobDetailProps {
  jobId: string;
}

function getSubTaskStatusSummary(subTask: any) {
  const counts = {
    COMPLETED: 0,
    PENDING: 0,
    FAILED: 0,
    IN_PROGRESS: 0,
  };

  subTask.subTaskComments.forEach((c: any) => {
    // @ts-ignore
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  const total = subTask.subTaskComments.length;
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
          subTaskComments: {
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
        <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
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

function getStatusColor(status: any) {
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
