import { TaskType } from "@repo/db";
import {
  Card,
  Flex,
  Text,
  Badge,
  Progress,
  Stack,
  Button,
} from "@mantine/core";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
// import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015

dayjs.extend(relativeTime);

const JOB_TYPE_MAP = {
  [TaskType.ANALYZE_POST]: "Analyzing content",
};

function calculateProgress(
  subTasks: { type: string; subTaskMentions: { status: string }[] }[]
) {
  const analyzeTask = subTasks.find(
    (st) => st.type === "ANALYZE_CONTENT_SENTIMENT"
  );
  if (!analyzeTask || !analyzeTask.subTaskMentions) return null;

  const total = analyzeTask.subTaskMentions.length;
  const completed = analyzeTask.subTaskMentions.filter(
    (c) => c.status === "COMPLETED"
  ).length;

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

interface JobListItemProps {
  post: {
    id: number;
    type: TaskType;
    updatedAt: Date;
    createdAt: Date;
    status: string;
    integration: {
      provider: {
        image: string;
        name: string;
      };
    };
    subTasks: { type: string; subTaskMentions: { status: string }[] }[];
  };
}

const JobListItem = ({ post }: JobListItemProps) => {
  console.log("POST", post);
  const progress = calculateProgress(post.subTasks);

  const estimatedTime = post.updatedAt.getTime() - post.createdAt.getTime();
  const durationInMinutes = Math.ceil(estimatedTime / 60000);
  return (
    <Link href={`/dashboard/jobs?jobId=${post.id}`} passHref legacyBehavior>
      <Card component="a" shadow="sm" radius="md" withBorder>
        <Flex justify="space-between">
          <Flex gap={12}>
            <Image
              alt="provider-logo"
              height={32}
              width={32}
              src={`/images/logos/${post?.integration?.provider?.image}`}
            />
            <Stack gap={0}>
              <Text size="lg" fw={600}>
                {JOB_TYPE_MAP[post?.type as keyof typeof JOB_TYPE_MAP]} for{" "}
                <span className="capitalize">
                  {post?.integration?.provider?.name}
                </span>
              </Text>
              <Flex gap={8} align="center">
                <Text mt={4} size="sm">
                  {dayjs(new Date(post.updatedAt)).format("DD/MM/YYYY")}
                </Text>
                <Badge color="success" size="xs" mt={4} className="capitalize">
                  {post?.status}
                </Badge>
              </Flex>
            </Stack>
          </Flex>
          <Flex>
            <Button disabled size="xs" variant="outline" color="error">
              Cancel Job
            </Button>
          </Flex>
        </Flex>

        <Flex gap={16} mt={12} justify="space-between">
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={4}>
              <Text fw={600}>Progress</Text>
              <Progress value={progress?.percent ?? 0} />
              <Text size="xs" c="dimmed">
                {progress?.percent}%
              </Text>
            </Stack>
          </Card>
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={0}>
              <Text fw={600}>Job Details</Text>
              <Flex justify="space-between">
                <Text size="sm">Started</Text>
                <Text> {dayjs(post.createdAt).fromNow(true)} ago</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Comments Processed</Text>
                <Text size="sm">
                  {progress?.completed ?? 0} / {progress?.total ?? 0}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Processing Time</Text>
                <Text size="sm">{durationInMinutes} Minutes</Text>
              </Flex>
            </Stack>
          </Card>
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={0}>
              <Text fw={600}>Job Metadata</Text>
              <Flex justify="space-between">
                <Text size="sm">Failed Comments</Text>
                <Text size="sm">-</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Retry Status</Text>
                <Text size="sm">-</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Last Attempt</Text>
                <Text size="sm">-</Text>
              </Flex>
            </Stack>
          </Card>
        </Flex>
      </Card>
    </Link>
  );
};

export default JobListItem;
