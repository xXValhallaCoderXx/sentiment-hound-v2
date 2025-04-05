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
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
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
        subTasks: true,
        integration: {
          include: {
            provider: true,
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
    <Box>
      <Table striped highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>ID</TableTh>
            <TableTh>Type</TableTh>
            <TableTh>Integration</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>Progress</TableTh>
            <TableTh>Created</TableTh>
            <TableTh>Updated</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {tasks.map((task) => {
            const totalJobs = task.subTasks.length;
            const completedJobs = task.subTasks.filter(
              (job) => job.status === SubTaskStatus.COMPLETED
            ).length;
            const failedJobs = task.subTasks.filter(
              (job) => job.status === SubTaskStatus.FAILED
            ).length;
            const progressPercentage =
              totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

            const hasErrors =
              task.errorMessage ||
              task.subTasks.some((job) => job.errorMessage);

            return (
              <TableTr
                key={task.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableTd>{task.id}</TableTd>
                <TableTd>
                  <Badge color={getTaskTypeColor(task.type)}>
                    {formatEnumValue(task.type)}
                  </Badge>
                </TableTd>
                <TableTd>
                  <Group>
                    <Text size="sm">{task.integration.provider.name}</Text>
                  </Group>
                </TableTd>
                <TableTd>
                  <Group gap="xs">
                    <Badge color={getStatusColor(task.status)}>
                      {formatEnumValue(task.status)}
                    </Badge>
                    {hasErrors && (
                      <Tooltip label="This task has errors">
                        <IconAlertCircle size={16} color="red" />
                      </Tooltip>
                    )}
                  </Group>
                </TableTd>
                <TableTd style={{ width: 200 }}>
                  <Box>
                    <Group mb={5}>
                      <Text size="xs">
                        {completedJobs} of {totalJobs} jobs
                      </Text>
                      <Text size="xs">{progressPercentage}%</Text>
                    </Group>
                  </Box>
                </TableTd>
                <TableTd>
                  {dayjs(new Date(task.createdAt)).format("DD/MM/YYYY")}
                </TableTd>
                <TableTd>
                  {dayjs(new Date(task.updatedAt)).format("DD/MM/YYYY")}
                </TableTd>
              </TableTr>
            );
          })}
        </TableTbody>
      </Table>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalCount}
        searchParams={{
          status: filters.status,
          type: filters.type,
        }}
      />
    </Box>
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
