import { Title, Box, Text, Alert } from "@mantine/core";
import IntegrationsView from "./IntegrationsView";
import { providersService, integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";

const IntegrationsPage = async (params: any) => {
  const session = await auth();
  const providers = await providersService.getProviders();
  const integrations = await integrationsService.getUserIntegrations(
    session?.user?.id as string
  );
  console.log("providers", params);
  console.log("integrations", integrations);

  return (
    <div className="h-full ">
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>Choose from a range of different ones</Text>
        <IntegrationsView providers={providers} integrations={integrations} />
      </Box>
    </div>
  );
};

export default IntegrationsPage;
