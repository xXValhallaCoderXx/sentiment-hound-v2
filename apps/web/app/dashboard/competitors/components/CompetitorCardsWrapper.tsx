import { Suspense } from "react";
import { 
  Card, 
  Text, 
  Title, 
  Group, 
  Skeleton,
  Stack,
  SimpleGrid
} from "@mantine/core";
import { competitorService } from "@repo/services";
import CompetitorCardsClient from "./CompetitorCards";

// Matches the service's Competitor type (with createdAt as Date)
type ServiceCompetitor = {
  id: number;
  name: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface CompetitorCardsWrapperProps {
  userId: string;
}

const CompetitorCardsWrapper = async ({ userId }: CompetitorCardsWrapperProps) => {
  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Title order={3}>Your Competitors</Title>
      </Group>
      
      <Suspense fallback={<CompetitorCardsSkeleton />}>
        <CompetitorCardsList userId={userId} />
      </Suspense>
    </Card>
  );
};

const CompetitorCardsList = async ({ userId }: { userId: string }) => {
  try {
    const competitors = await competitorService.getUserCompetitors(userId);
    // Ensure createdAt is a string for each competitor
    const serializedCompetitors = competitors.map(
      (competitor: ServiceCompetitor) => ({
        ...competitor,
        createdAt:
          competitor.createdAt instanceof Date
            ? competitor.createdAt.toISOString()
            : competitor.createdAt,
      })
    );

    return (
      <CompetitorCardsClient
        competitors={serializedCompetitors}
        userId={userId}
      />
    );
  } catch (error) {
    console.error("Error loading competitors:", error);
    return (
      <Text c="red" ta="center" py="xl">
        Failed to load competitors. Please try again.
      </Text>
    );
  }
};

const CompetitorCardsSkeleton = () => (
  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} withBorder p="sm" radius="md">
        <Stack gap="xs">
          <Skeleton height={20} />
          <Skeleton height={16} width="60%" />
          <Group justify="space-between" mt="md">
            <Skeleton height={20} width={50} />
            <Skeleton height={16} width={60} />
          </Group>
        </Stack>
      </Card>
    ))}
  </SimpleGrid>
);

export default CompetitorCardsWrapper;