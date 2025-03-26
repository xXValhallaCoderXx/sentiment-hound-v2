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
  Progress,
  Group,
  Card,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Tooltip,
} from "@mantine/core";
import { IconChevronRight, IconAlertCircle } from "@tabler/icons-react";

import { JobStatus, TaskStatus, TaskType } from "@repo/db";

// Create this service or use an existing one
import { prisma } from "@repo/db";

export default async function JobListTable({ userId }: { userId: string }) {
  // Fetch tasks with their jobs
  const tasks = await prisma.task.findMany({
    where: { userId },
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
    <Accordion>
      <Box>
        <Table striped highlightOnHover withBorder>
          <TableThead>
            <TableTr>
              <TableTh></TableTh>
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
                totalJobs > 0
                  ? Math.round((completedJobs / totalJobs) * 100)
                  : 0;

              const hasErrors =
                task.errorMessage || task.jobs.some((job) => job.errorMessage);

              return (
                <AccordionItem value={`task-${task.id}`} key={task.id}>
                  <TableTr className="cursor-pointer hover:bg-gray-50">
                    <TableTd>
                      <AccordionControl>
                        <IconChevronRight size={16} />
                      </AccordionControl>
                    </TableTd>
                    <TableTd>{task.id}</TableTd>
                    <TableTd>
                      <Badge color={getTaskTypeColor(task.type)}>
                        {formatEnumValue(task.type)}
                      </Badge>
                    </TableTd>
                    <TableTd>
                      <Group spacing="xs">
                        <Text size="sm">{task.integration.provider.name}</Text>
                      </Group>
                    </TableTd>
                    <TableTd>
                      <Group spacing="xs">
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
                        <Group position="apart" mb={5}>
                          <Text size="xs">
                            {completedJobs} of {totalJobs} jobs
                          </Text>
                          <Text size="xs">{progressPercentage}%</Text>
                        </Group>
                        <Progress
                          sections={[
                            {
                              value:
                                (completedJobs / Math.max(totalJobs, 1)) * 100,
                              color: "green",
                            },
                            {
                              value:
                                (failedJobs / Math.max(totalJobs, 1)) * 100,
                              color: "red",
                            },
                          ]}
                        />
                      </Box>
                    </TableTd>
                    <TableTd>
                      {/* {format(new Date(task.createdAt), "MMM d, yyyy HH:mm")} */}
                    </TableTd>
                    <TableTd>
                      {/* {format(new Date(task.updatedAt), "MMM d, yyyy HH:mm")} */}
                    </TableTd>
                  </TableTr>

                  <AccordionPanel>
                    <Card withBorder>
                      <Text fw={500} mb="md">
                        Jobs for Task #{task.id}
                      </Text>

                      <Table>
                        <TableThead>
                          <TableTr>
                            <TableTh>Job ID</TableTh>
                            <TableTh>Type</TableTh>
                            <TableTh>Status</TableTh>
                            <TableTh>Created</TableTh>
                            <TableTh>Updated</TableTh>
                          </TableTr>
                        </TableThead>
                        <TableTbody>
                          {task.jobs.map((job) => (
                            <TableTr key={job.id}>
                              <TableTd>{job.id}</TableTd>
                              <TableTd>
                                <Badge>{formatEnumValue(job.type)}</Badge>
                              </TableTd>
                              <TableTd>
                                <Badge color={getStatusColor(job.status)}>
                                  {formatEnumValue(job.status)}
                                </Badge>
                              </TableTd>
                              <TableTd>
                                {/* {format(
                                  new Date(job.createdAt),
                                  "MMM d, yyyy HH:mm"
                                )} */}
                              </TableTd>
                              <TableTd>
                                {/* {format(
                                  new Date(job.updatedAt),
                                  "MMM d, yyyy HH:mm"
                                )} */}
                              </TableTd>
                            </TableTr>
                          ))}
                        </TableTbody>
                      </Table>

                      {(task.errorMessage ||
                        task.jobs.some((job) => job.errorMessage)) && (
                        <Box mt="md">
                          <Text fw={500} color="red" mb="sm">
                            Error Details
                          </Text>

                          {task.errorMessage && (
                            <Card withBorder mb="sm">
                              <Text fw={500} size="sm">
                                Task Error
                              </Text>
                              <Text size="sm" color="dimmed">
                                {task.errorMessage}
                              </Text>
                            </Card>
                          )}

                          {task.jobs
                            .filter((job) => job.errorMessage)
                            .map((job) => (
                              <Card key={job.id} withBorder mb="sm">
                                <Text fw={500} size="sm">
                                  Job #{job.id} Error
                                </Text>
                                <Text size="sm" color="dimmed">
                                  {job.errorMessage}
                                </Text>
                              </Card>
                            ))}
                        </Box>
                      )}
                    </Card>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </TableTbody>
        </Table>
      </Box>
    </Accordion>
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
