import { Title, Box, Text, Alert } from "@mantine/core";
import { Suspense } from "react";
import IntegrationCardsSkeleton from "./components/IntegrationCardsSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";

const IntegrationsPage = async (params: any) => {
  const isSuccess = params?.searchParams?.success === "true";

  return (
    <div className="h-full ">
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>
          Connect your social accounts to seamlessly integrate and manage your
          content within our application.
          <br />
          Select an integration below to get started.
        </Text>
        <IntegrationAlert />
        <Box mt={32}>
          <Suspense fallback={<IntegrationCardsSkeleton />}>
            <IntegrationCards />
          </Suspense>

        </Box>
      </Box>
    </div>
  );
};

export default IntegrationsPage;
