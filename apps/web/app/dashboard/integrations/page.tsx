import { Title, Box, Text, Container, Flex } from "@mantine/core";
import { Suspense } from "react";
import IntegrationCardsSkeleton from "./components/IntegrationCardsSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";

const IntegrationsPage = async () => {
  return (
    <Box p={16}>
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>
          Connect your social accounts to seamlessly integrate and manage your
          content within our application.
          <br />
          Select an integration below to get started.
        </Text>

        <IntegrationAlert />
        <Box mt={32} maw={1420}>
          <Suspense fallback={<IntegrationCardsSkeleton />}>
            <IntegrationCards />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default IntegrationsPage;
