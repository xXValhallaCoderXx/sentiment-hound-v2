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
import { JobStatus, TaskStatus, TaskType } from "@repo/db";

// Create this service or use an existing one
import { prisma } from "@repo/db";

interface JobListTableProps {
  userId: string;
  filters: { status?: TaskStatus; type?: TaskType };
}

export default async function JobListTable({
  userId,
  filters,
}: JobListTableProps) {
  // Fetch tasks with their jobs based on filters
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: filters.status,
      type: filters.type,
    },
    include: {
      jobs: true,
      integration: {
        include: {
          provider: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
            const totalJobs = task.jobs.length;
            const completedJobs = task.jobs.filter(
              (job) => job.status === JobStatus.COMPLETED
            ).length;
            const failedJobs = task.jobs.filter(
              (job) => job.status === JobStatus.FAILED
            ).length;
            const progressPercentage =
              totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

            const hasErrors =
              task.errorMessage || task.jobs.some((job) => job.errorMessage);

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
    </Box>
  );
}

// Helper functions
function getStatusColor(status: TaskStatus | JobStatus) {
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
