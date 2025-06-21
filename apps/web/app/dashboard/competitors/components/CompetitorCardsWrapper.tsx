import { Suspense } from "react";
import { 
  Card, 
  Title, 
  Group, 
} from "@mantine/core";
import { competitorService } from "@repo/services";
import CompetitorCardsClient from "./CompetitorCards";
import ListLoadingSkeleton from "@/components/molecules/ListLoadingSkeleton";
import ErrorState from "@/components/molecules/ErrorState";

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
      
      <Suspense fallback={<ListLoadingSkeleton itemCount={3} layout="grid" gridCols={{ base: 1, sm: 2, lg: 3 }} showTitle={false} showActionButton={false} />}>
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
      <ErrorState
        title="Failed to load competitors"
        message="We couldn't load your competitors. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }
};

export default CompetitorCardsWrapper;