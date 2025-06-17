import { Text, Card, Stack, SimpleGrid, Flex } from "@mantine/core";
// import { IconAlertCircle } from "@tabler/icons-react"; // Unused
// import dayjs from "dayjs"; // Unused
import JobListItem from "@/components/molecules/JobListItem";
import { TaskStatus, TaskType } from "@repo/db"; // SubTaskStatus was unused
// import PaginationControls from "./PaginationControls"; // Unused

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
  const [tasks] = await Promise.all([
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
            subTaskMentions: {
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

  // const totalPages = Math.ceil(totalCount / pageSize); // Unused

  if (!tasks || tasks.length === 0) {
    return (
      <Flex justify="center" align="center" flex={1} h="100%">
        <Card withBorder p="xl" ta="center">
          <Text fw={500} mb="md">
            No Jobs Found
          </Text>
          <Text size="sm" color="dimmed">
            Jobs will appear here when you fetch content or run analysis tasks
          </Text>
        </Card>
      </Flex>
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

// Helper functions (getStatusColor, getTaskTypeColor, formatEnumValue were unused)
