import {
  Box,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  TableTbody,
  Text,
  Badge,
  Group,
  Card,
  Stack,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import JobListItem from "@/components/molecules/JobListItem";
import { SubTaskStatus, TaskStatus, TaskType } from "@repo/db";
import PaginationControls from "./PaginationControls";

// Create this service or use an existing one
import { prisma } from "@repo/db";

interface JobListTableProps {
  userId: string;
  filters: { status?: TaskStatus; type?: TaskType };
  pagination: {
    page: number;
    pageSize: number;
  };
}

export default async function JobListTable({
  userId,
  filters,
  pagination,
}: JobListTableProps) {
  const { page, pageSize } = pagination;

  // Calculate pagination values
  const skip = (page - 1) * pageSize;

  // Fetch tasks with pagination
  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId,
        status: filters.status,
        type: filters.type,
      },
      include: {
        integration: {
          include: {
            provider: true,
          },
        },
        subTasks: {
          where: {
            type: "ANALYZE_CONTENT_SENTIMENT",
          },
          include: {
            subTaskComments: {
              select: {
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),

    prisma.task.count({
      where: {
        userId,
        status: filters.status,
        type: filters.type,
      },
    }),
  ]);
  

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!tasks || tasks.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <Text fw={500} mb="md">
          No Jobs Found
        </Text>
        <Text size="sm" color="dimmed">
          Jobs will appear here when you fetch content or run analysis tasks
        </Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1 }} spacing="md" verticalSpacing="md">
        {tasks.map((post, index: number) => (
          <JobListItem key={index} post={post} />
        ))}
      </SimpleGrid>
    </Stack>
  );


}

// Helper functions
function getStatusColor(status: TaskStatus | SubTaskStatus) {
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

function getTaskTypeColor(type: TaskType) {
  switch (type) {
    case "FETCH_CONTENT":
      return "blue";
    case "ANALYZE_COMMENTS":
      return "violet";
    case "FULL_SYNC":
      return "orange";
    case "PARTIAL_SYNC":
      return "teal";
    default:
      return "gray";
  }
}

function formatEnumValue(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
