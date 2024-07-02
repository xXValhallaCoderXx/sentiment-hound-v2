import { Title, Box, Text, Alert } from "@mantine/core";
import IntegrationsView from "./IntegrationsView";
import { providersService } from "services";

const IntegrationsPage = async (params: any) => {
  const providers = await providersService.getProviders();
  console.log("providers", params);

  return (
    <div className="h-full ">
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>Choose from a range of different ones</Text>
        <IntegrationsView providers={providers} />
      </Box>
    </div>
  );
};

export default IntegrationsPage;
