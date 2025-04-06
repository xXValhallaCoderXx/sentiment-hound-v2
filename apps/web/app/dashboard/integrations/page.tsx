import { Title, Box, Text } from "@mantine/core";
import { Suspense } from "react";
import IntegrationCardsSkeleton from "./components/IntegrationCardsSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";
import PageLayout from "@/components/templates/PageLayout";

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
          <Suspense fallback={<IntegrationCardsSkeleton />}>
            <IntegrationCards />
          </Suspense>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default IntegrationsPage;
