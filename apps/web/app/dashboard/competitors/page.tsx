import { auth } from "@/lib/next-auth.lib";
import { Box, Title, Text, Group, Flex, Stack } from "@mantine/core";
import { planService } from "@repo/services";
import NoData from "@/components/molecules/NoData";
import PageLayout from "@/components/templates/PageLayout";
import CompetitorCardsWrapper from "./components/CompetitorCardsWrapper";
import AddCompetitorForm from "./components/AddCompetitorForm";
import CompetitorChart from "./components/CompetitorChart";

const CompetitorsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <PageLayout
        title="Competitors"
        description="Track and analyze your competitors' sentiment"
      >
        <Box p="xl" ta="center">
          <Text>You must be logged in to view this page</Text>
        </Box>
      </PageLayout>
    );
  }

  try {
    const userPlan = await planService.getUserPlan(session.user.id);
    
    if (!userPlan) {
      return (
        <PageLayout
          title="Competitors"
          description="Track and analyze your competitors' sentiment"
        >
          <Flex align="center" justify="center">
            <NoData
              title="No Plan Found"
              description="Please upgrade to access competitor analysis"
            />
          </Flex>
        </PageLayout>
      );
    }

    // Check if user has competitor analysis access
    const hasAccess = userPlan.features && 
      (userPlan.features as any).competitorAnalysis;

    if (!hasAccess) {
      return (
        <PageLayout
          title="Competitors"
          description="Track and analyze your competitors' sentiment"
        >
          <Flex align="center" justify="center">
            <NoData
              title="Upgrade Required"
              description="Competitor analysis is available on paid plans"
            />
          </Flex>
        </PageLayout>
      );
    }

    return (
      <PageLayout
        title="Competitors"
        description="Track and analyze your competitors' sentiment across multiple platforms"
      >
        <Box className="px-4">
          <Stack gap={24}>
            {/* Add Competitor Form */}
            <AddCompetitorForm userId={session.user.id} />
            
            {/* Competitor Cards */}
            <CompetitorCardsWrapper userId={session.user.id} />
            
            {/* Competitor Analysis Chart */}
            <CompetitorChart userId={session.user.id} />
          </Stack>
        </Box>
      </PageLayout>
    );
  } catch (error) {
    console.error("Error loading competitors page:", error);
    return (
      <PageLayout
        title="Competitors"
        description="Track and analyze your competitors' sentiment"
      >
        <Box p="xl" ta="center">
          <Text color="red">An error occurred while loading data</Text>
        </Box>
      </PageLayout>
    );
  }
};

export default CompetitorsPage;