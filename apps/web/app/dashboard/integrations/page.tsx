import { Title, Box, Text, Container } from "@mantine/core";
import { Suspense } from "react";
import IntegrationCardsSkeleton from "./components/IntegrationCardsSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";
import { getIntegration } from "@/actions/integrations.actions";
import { ErrorNotification } from "@/components/atoms/ErrorNotification";

const IntegrationsPage = async (params: any) => {
  const response = await getIntegration(1);

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

        <ErrorNotification
          error={{
            code: "ISS",
            error: "adasd",
            status: 500,
          }}
        />
        <IntegrationAlert />
        <Box mt={32} className="w-full 2xl:w-3/4">
          <Suspense fallback={<IntegrationCardsSkeleton />}>
            <IntegrationCards />
          </Suspense>
        </Box>
      </Box>
    </div>
  );
};

export default IntegrationsPage;
