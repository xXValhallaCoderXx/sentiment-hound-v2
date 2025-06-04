import {
  Card,
  Flex,
  Text,
  Badge,
  Progress,
  Button,
  Title,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconArrowUp,
  IconArrowDown,
  IconExternalLink,
  IconFileExport,
} from "@tabler/icons-react";
import Link from "next/link";

interface PostListItemProps {
  provider: "twitter" | "facebook" | "instagram" | "youtube" | string;
  postDate: string;
  commentsCount: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topAspects: string[];
  areasOfConcern: string[];
  title?: string;
  description?: string;
  imageUrl?: string;
  postUrl?: string;
}

const PostListItem = ({
  provider,
  postDate,
  commentsCount,
  sentimentDistribution,
  topAspects,
  areasOfConcern,
  title,
  // description,
  // imageUrl,
  postUrl,
}: PostListItemProps) => {
  // Get the appropriate provider icon
  const getProviderIcon = () => {
    switch (provider) {
      case "twitter":
        return <IconBrandTwitter size={24} />;
      case "facebook":
        return <IconBrandFacebook size={24} />;
      case "instagram":
        return <IconBrandInstagram size={24} />;
      case "youtube":
        return <IconBrandYoutube color="var(--mantine-color-error-6)" size={32} />;
      default:
        return <IconBrandYoutube color="var(--mantine-color-error-6)" size={32} />;
    }
  };

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={16}>
          {getProviderIcon()}
          <Flex direction="column">
            <Flex gap={8}>
              <Text fw={600} truncate>
                {title || `Post from ${provider}`}
              </Text>
              <Badge color="success" size="xs" mt={4} className="capitalize">
                Analyzed
              </Badge>
            </Flex>
            <Text size="sm" color="dimmed">
              Published: {postDate}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={16}>
          <Button
            component={Link}
            href={postUrl || "#"}
            size="xs"
            target="_blank"
            variant="outline"
            radius="sm"
            color="secondary"
            rightSection={<IconFileExport size={16} />}
          >
            Export CSV
          </Button>
          <Button
            component={Link}
            href={postUrl || "#"}
            size="xs"
            target="_blank"
            variant="outline"
            color="secondary"
            radius="sm"
            rightSection={<IconExternalLink size={16} />}
          >
            View Post
          </Button>
        </Flex>
      </Flex>
      <Flex mt={16} gap={96}>
        <Flex direction="column">
          <Title order={6}>Comments</Title>
          <Title mt={8} order={3}>
            {commentsCount}
          </Title>
        </Flex>
        <Flex direction="column">
          <Title order={6}>Sentiment Distribution</Title>

          <Flex gap={8} direction="column" pr={16}>
            <Flex align="center" gap={8}>
              <Progress
                value={sentimentDistribution.positive}
                color="success"
                size="md"
                style={{ flex: 1 }}
              />
              <Text size="xs">{sentimentDistribution.positive}%</Text>
            </Flex>
            <Flex align="center" gap={8}>
              <Progress
                value={sentimentDistribution.neutral}
                color="warning"
                size="md"
                style={{ flex: 1 }}
              />
              <Text size="xs">{sentimentDistribution.neutral}%</Text>
            </Flex>
            <Flex align="center" gap={8}>
              <Progress
                value={sentimentDistribution.negative}
                color="error"
                size="md"
                style={{ flex: 1 }}
              />
              <Text size="xs">{sentimentDistribution.negative}%</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Title order={6}>Top Aspects</Title>
          <Flex direction="column" gap={8} mb="md">
            {topAspects.map((aspect, index) => (
              <Flex gap={4} pl={2} key={index}>
                <Text fw={500} className="capitalize" size="xs">
                  {aspect}
                </Text>
                <IconArrowUp size={16} color="var(--mantine-color-success-6)" />
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex direction="column">
          <Title order={6}>Areas of Concern</Title>

          <Flex direction="column" gap={8} mb="md">
            {areasOfConcern.map((concern, index) => (
              <Flex gap={4} pl={2} key={index}>
                <Text fw={500} className="capitalize" size="xs">
                  {concern}
                </Text>
                <IconArrowDown size={16} color="var(--mantine-color-error-6)" />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      {/* <CardSection>
        {imageUrl && (
          <Image
            src={imageUrl}
            height={160}
            alt={title || "Post thumbnail"}
            fallbackSrc="https://placehold.co/600x400?text=Post+Image"
          />
        )}
      </CardSection> */}
    </Card>
  );
};

export default PostListItem;