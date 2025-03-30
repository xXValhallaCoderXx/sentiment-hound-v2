import {
  Card,
  CardSection,
  Flex,
  Text,
  Badge,
  Group,
  Button,
  Image,
  Box,
  Stack,
  Title,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
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
  description,
  imageUrl,
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
        return <IconBrandYoutube color="red" size={32} />;
      default:
        return <IconBrandYoutube color="red" size={32} />;
    }
  };

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={8}>
          {getProviderIcon()}
          <Flex direction="column">
            <Text fw={500} truncate>
              {title || `Post from ${provider}`}
            </Text>
            <Text size="sm" color="dimmed">
              {postDate}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <Button
            component={Link}
            href={postUrl || "#"}
            target="_blank"
            variant="light"
            fullWidth
            mt="md"
            radius="md"
          >
            View Post
          </Button>
        </Flex>
      </Flex>
      <Flex mt={16}>
        <Flex direction="column" w="25%">
          <Title order={5}>Comments</Title>
          <Title order={3}>{commentsCount}</Title>
        </Flex>
        <Flex direction="column" w="25%">
          <Title order={5}>Sentiment Distribution</Title>

          <Flex gap={8} direction="column" w="25%">
            <Badge color="green">
              Positive: {sentimentDistribution.positive}%
            </Badge>
            <Badge color="yellow">
              Neutral: {sentimentDistribution.neutral}%
            </Badge>
            <Badge color="red">
              Negative: {sentimentDistribution.negative}%
            </Badge>
          </Flex>
        </Flex>
        <Flex direction="column" w="25%">
          <Title order={5}>Top Aspects</Title>
          <Flex direction="column" gap={8} mb="md">
            {topAspects.map((aspect, index) => (
              <Badge key={index} color="blue">
                {aspect}
              </Badge>
            ))}
          </Flex>
        </Flex>
        <Flex direction="column" w="25%">
          <Title order={5}>Areas of Concern</Title>

          <Flex direction="column" gap={8} mb="md">
            {areasOfConcern.map((concern, index) => (
              <Badge key={index} color="red">
                {concern}
              </Badge>
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
