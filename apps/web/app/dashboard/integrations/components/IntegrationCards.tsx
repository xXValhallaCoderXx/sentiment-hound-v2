import Image from "next/image";
import { Text, Grid, GridCol, Card, Divider, Flex } from "@mantine/core";
import { getAllProviders } from "@/actions/providers.actions";
import IntegrationButton from "./IntegrationButton";
import {
  getUserIntegrations,
  integrateProvider,
  revokeIntegration,
} from "@/actions/integrations.actions";

const IntegrationCards = async () => {
  const providers = await getAllProviders();
  console.log("PROVIDERS: ", providers);
  const youtubeIntegration = providers?.data?.find(
    (provider) => provider.name === "youtube"
  );
  const userIntegrations = await getUserIntegrations();


  return (
    <Grid className="mt-4">
      {providers?.data?.map((provider) => {
        const isConnected = userIntegrations?.data?.find(
          (integration) => integration.providerId === provider.id
        );

        return (
          <GridCol key={provider.id} span={4}>
            <form action={isConnected ? revokeIntegration : integrateProvider}>
              <Card shadow="md">
                <Flex align="center" gap={2}>
                  <Image
                    alt="provider-image"
                    height={50}
                    width={50}
                    src={`/images/logos/youtube-logo.png`}
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
                  isConnected={Boolean(isConnected?.id)}
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
