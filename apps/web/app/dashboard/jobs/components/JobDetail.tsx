import { taskService } from "@repo/services";
import { FC } from "react";
import { Flex, Box, Title, Badge, Stack } from "@mantine/core";
import dayjs from "dayjs";
interface JobDetailProps {
  jobId: string;
}

const JobDetail: FC<JobDetailProps> = async ({ jobId }) => {
  if (!jobId) return null;

  const x = await taskService.getTask({
    where: { id: parseInt(jobId) },
    include: { subTasks: { include: { subTaskComments: true } } },
  });

  return (
    <Stack>
      <Flex align="center" justify="space-between">
        <Title order={4}>{x.type}</Title>
        <Badge>{x.status}</Badge>
      </Flex>
      <Flex align="center" justify="space-between">
        <Title order={6}>Created At</Title>
        <Title order={6} fw={500}>
          {dayjs(new Date(x.createdAt)).format("DD/MM/YYYY")}
        </Title>
      </Flex>
      <Flex align="center" justify="space-between">
        <Title order={6}>Updated At</Title>
        <Title order={6} fw={500}>
          {dayjs(new Date(x.updatedAt)).format("DD/MM/YYYY")}
        </Title>
      </Flex>
      <Title order={4}>Tasks</Title>
    </Stack>
  );
};

export default JobDetail;
