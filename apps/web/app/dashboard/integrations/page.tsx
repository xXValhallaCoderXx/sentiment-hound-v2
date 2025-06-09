import { Title, Box, Text, Stack } from "@mantine/core";
import { Suspense } from "react";
import ListLoadingSkeleton from "@/components/molecules/ListLoadingSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";
import PageLayout from "@/components/templates/PageLayout";
import IntegrationKeywords from "./components/IntegrationKeywords";

const IntegrationsPage = async () => {
  return (
    <PageLayout
      title="Integrations"
      description="Connect your social accounts to seamlessly integrate and manage your content within our application."
    >
      <Box className="px-4">
        <Text>Select an integration below to get started.</Text>

        <IntegrationAlert />
        <Box mt={32} maw={1420}>
          <Suspense fallback={<ListLoadingSkeleton itemCount={3} gridCols={{ base: 12, sm: 6, md: 4 }} showTitle={false} showActionButton={false} />}>
            <IntegrationCards />
          </Suspense>
        </Box>
        <Stack>
          <Title order={3} mt={32}>
            Keywords
          </Title>
          <IntegrationKeywords />
        </Stack>
      </Box>
    </PageLayout>
  );
};

export default IntegrationsPage;
