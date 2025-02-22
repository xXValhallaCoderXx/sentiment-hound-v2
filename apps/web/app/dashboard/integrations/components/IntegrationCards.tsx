import Image from "next/image";
import { Text, Grid, GridCol, Card, Divider, Flex } from "@mantine/core";
import { getAllProviders } from "@/actions/providers.actions";
import IntegrationButton from "./IntegrationButton";
import { revokeOauthAction } from "../actions";
import {
  getUserIntegrations,
  integrateProvider,
} from "@/actions/integrations.actions";

const IntegrationCards = async () => {
  const providers = await getAllProviders();
  const userIntegrations = await getUserIntegrations("id");

  console.log("user integrarions?: ", userIntegrations);

  return (
    <Grid className="mt-4">
      {providers?.data?.map((provider) => {
        // const isConnected = userIntegrations.includes(provider.id);
        const isConnected = false;
        return (
          <GridCol key={provider.id} span={4}>
            <form action={isConnected ? revokeOauthAction : integrateProvider}>
              <Card shadow="md">
                <Flex align="center" gap={2}>
                  <Image
                    alt="provider-image"
                    height={50}
                    width={50}
                    src={`/images/logos/${provider?.image}`}
                  />
                  <Text size="lg" fw={500} className="capitalize">
                    {provider.name}
                  </Text>
                </Flex>
                <Text size="xs">{provider.description}</Text>
                <Divider className="mt-4" />
                <input type="hidden" name="providerId" value={provider.id} />
                <IntegrationButton
                  isDisabled={provider.name !== "youtube"}
                  isConnected={isConnected}
                />
              </Card>
            </form>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default IntegrationCards;
