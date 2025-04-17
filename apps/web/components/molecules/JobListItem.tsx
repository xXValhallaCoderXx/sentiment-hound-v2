import { TaskType } from "@repo/db";
import {
  Card,
  Flex,
  Text,
  Badge,
  Progress,
  Stack,
  Paper,
  Button,
} from "@mantine/core";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";

const JOB_TYPE_MAP = {
  [TaskType.ANALYZE_POST]: "Analyzing content",
};


const JobListItem = ({ post }: any) => {
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
                {/* @ts-ignore */}
                {JOB_TYPE_MAP[post?.type]} for{" "}
                <span className="capitalize">
                  {post?.integration?.provider?.name}
                </span>
              </Text>
              <Flex gap={8} align="center">
                <Text mt={4} size="sm">
                  {dayjs(new Date(post.updatedAt)).format("DD/MM/YYYY")}
                </Text>
                <Badge color="green" size="xs" mt={4} className="capitalize">
                  {post?.status}
                </Badge>
              </Flex>
            </Stack>
          </Flex>
          <Flex>
            <Button disabled size="xs" variant="outline" color="red">
              Cancel Job
            </Button>
          </Flex>
        </Flex>

        <Flex gap={16} mt={12} justify="space-between">
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={4}>
              <Text fw={600}>Progress</Text>
              <Progress value={50} />
              <Text size="xs" c="dimmed">
                75%
              </Text>
            </Stack>
          </Card>
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={0}>
              <Text fw={600}>Job Details</Text>
              <Flex justify="space-between">
                <Text size="sm">Started</Text>
                <Text size="sm">2 Hours Ago</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Comments Processed</Text>
                <Text size="sm">184 / 245</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Estimated Time</Text>
                <Text size="sm">43 Minutes</Text>
              </Flex>
            </Stack>
          </Card>
          <Card w="100%" withBorder shadow="xs">
            <Stack gap={0}>
              <Text fw={600}>Job Details</Text>
              <Flex justify="space-between">
                <Text size="sm">Started</Text>
                <Text size="sm">2 Hours Ago</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Comments Processed</Text>
                <Text size="sm">184 / 245</Text>
              </Flex>
              <Flex justify="space-between">
                <Text size="sm">Estimated Time</Text>
                <Text size="sm">43 Minutes</Text>
              </Flex>
            </Stack>
          </Card>
        </Flex>
      </Card>
    </Link>
  );
};

export default JobListItem;
