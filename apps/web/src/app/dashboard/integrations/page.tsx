import { Title, Box, Text, Alert } from "@mantine/core";
import { Suspense } from "react";
import IntegrationCardsSkeleton from "./components/IntegrationCardsSkeleton";
import IntegrationAlert from "./components/IntegrationAlert";
import IntegrationCards from "./components/IntegrationCards";

const IntegrationsPage = async (params: any) => {
  const isSuccess = params?.searchParams?.success === "true";
  console.log("IS SUCCESS", isSuccess);
  return (
    <div className="h-full ">
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>Choose from a range of different ones</Text>
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
