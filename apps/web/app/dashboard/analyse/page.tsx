import { auth } from "@/lib/next-auth.lib";
import { Box, Title, Text, Group, Flex, Stack } from "@mantine/core";
import { integrationsService, providerService } from "@repo/services";
import NoData from "@/components/molecules/NoData";
import YoutubeUrlForm from "./components/YoutubeUrlForm";
import RedditJobButton from "./components/RedditJobButton";

const AnalysePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth();
  const { status, type } = await searchParams;

  if (!session?.user?.id) {
    return (
      <Box p="xl" ta="center">
        <Text>You must be logged in to view this page</Text>
      </Box>
    );
  }

  try {
    const integrations = await integrationsService.getUserIntegrations(
      session.user.id
    );

    const providers = await providerService.getProviderByName("youtube");
    const redditProvider = await providerService.getProviderByName("reddit");
    const redditIntegration = integrations.find(
      (integration) => integration.providerId === redditProvider.id
    );

    const youtubeIntegration = integrations.find(
      (integration) => integration.providerId === providers.id
    );

    if (integrations.length < 1) {
      return (
        <Flex align="center" justify="center">
          <NoData
            title="No Integrations Found"
            description="Please integrate a social media account"
          />
        </Flex>
      );
    }

    return (
      <Box p="xl">
        <Group mb="lg">
          <div>
            <Title order={2}>Analyse Content</Title>
            <Text color="dimmed">
              View your content and decide which you want to sync
            </Text>
          </div>
        </Group>
        <Stack gap={16}>
          <YoutubeUrlForm integration={String(youtubeIntegration?.id)} />
          <Stack>
            <Title order={3}>Reddit</Title>
            <RedditJobButton
              integration={String(redditIntegration?.id)}
              userId={session.user.id}
            />
          </Stack>
        </Stack>
      </Box>
    );
  } catch (error) {
    console.error("Error loading jobs page:", error);
    return (
      <Box p="xl" ta="center">
        <Text color="red">An error occurred while loading data</Text>
      </Box>
    );
  }
};

export default AnalysePage;
