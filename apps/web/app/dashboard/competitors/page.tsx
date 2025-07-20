import { auth } from "@/lib/next-auth.lib";
import { Box, Text, Flex, Stack, Title } from "@mantine/core";
import { planService } from "@repo/services";
import NoData from "@/components/molecules/NoData";
import CompetitorCardsWrapper from "./components/CompetitorCardsWrapper";
import AddCompetitorForm from "./components/AddCompetitorForm";
import CompetitorChart from "./components/CompetitorChart";
import TrialCompetitorDemo from "./components/TrialCompetitorDemo";

const CompetitorsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <Box p={{ base: 12, sm: 16, md: 24 }}>
        <Stack gap={24}>
          <Title order={1} fw={600}>
            Competitors
          </Title>
          <Text c="dimmed">
            Track and analyze your competitors&apos; sentiment
          </Text>
          <Box p="xl" ta="center">
            <Text>You must be logged in to view this page</Text>
          </Box>
        </Stack>
      </Box>
    );
  }

  try {
    const userPlan = await planService.getUserPlan(session.user.id);

    if (!userPlan) {
      return (
        <Box p={{ base: 12, sm: 16, md: 24 }}>
          <Stack gap={24}>
            <Title order={1} fw={600}>
              Competitors
            </Title>
            <Text c="dimmed">
              Track and analyze your competitors&apos; sentiment
            </Text>
            <Flex align="center" justify="center">
              <NoData
                title="No Plan Found"
                description="Please upgrade to access competitor analysis"
              />
            </Flex>
          </Stack>
        </Box>
      );
    }

    // Check if user has competitor analysis access
    const hasAccess =
      userPlan.features &&
      (userPlan.features as Record<string, unknown>).competitorAnalysis;

    if (!hasAccess) {
      return (
        <Box p={{ base: 12, sm: 16, md: 24 }}>
          <Stack gap={24}>
            <Title order={1} fw={600}>
              Competitors
            </Title>
            <Text c="dimmed">
              Track and analyze your competitors&apos; sentiment
            </Text>
            <Flex align="center" justify="center">
              <NoData
                title="Upgrade Required"
                description="Competitor analysis is available on paid plans"
              />
            </Flex>
          </Stack>
        </Box>
      );
    }

    // Show demo for trial users
    const isTrialUser = userPlan.name === "trial";

    if (isTrialUser) {
      return (
        <Box p={{ base: 12, sm: 16, md: 24 }}>
          <Stack gap={24}>
            <Title order={1} fw={600}>
              Competitors
            </Title>
            <Text c="dimmed">
              Track and analyze your competitors&apos; sentiment across multiple
              platforms
            </Text>
            <Box className="px-4">
              <Stack gap={24}>
                <TrialCompetitorDemo />
              </Stack>
            </Box>
          </Stack>
        </Box>
      );
    }

    return (
      <Box p={{ base: 12, sm: 16, md: 24 }}>
        <Stack gap={24}>
          <Title order={1} fw={600}>
            Competitors
          </Title>
          <Text c="dimmed">
            Track and analyze your competitors&apos; sentiment across multiple
            platforms
          </Text>
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
        </Stack>
      </Box>
    );
  } catch (error) {
    console.error("Error loading competitors page:", error);
    return (
      <Box p={{ base: 12, sm: 16, md: 24 }}>
        <Stack gap={24}>
          <Title order={1} fw={600}>
            Competitors
          </Title>
          <Text c="dimmed">
            Track and analyze your competitors&apos; sentiment
          </Text>
          <Box p="xl" ta="center">
            <Text color="red">An error occurred while loading data</Text>
          </Box>
        </Stack>
      </Box>
    );
  }
};

export default CompetitorsPage;
