import { auth } from "@/lib/next-auth.lib";
import { Box, Title, Text, Group, Button, Flex } from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import { integrationsService } from "@repo/services";
import NoData from "@/components/molecules/NoData";

const AnalysePage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
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
              View you content and decide which you want to sync
            </Text>
          </div>
        </Group>
        Hahaha
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
