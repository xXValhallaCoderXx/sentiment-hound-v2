import Image from "next/image";
import { Text, Grid, GridCol, Card, Divider, Flex } from "@mantine/core";
// import { providersService, integrationsService } from "services";
// import { auth } from "@/lib/next-auth.lib";
import IntegrationButton from "./IntegrationButton";
import { integrateOauthAction, revokeOauthAction } from "../actions";

const IntegrationCards = async () => {
  // const session = await auth();
  // const providers = await providersService.getProviders();
  // const integrations = await integrationsService.getUserIntegrations(
  //   session?.user?.id as string
  // );

  // const userIntegrations = integrations?.map(
  //   (integration) => integration.providerId
  // );

  return (
    <Grid className="mt-4">
      sss
      {/* {providers.map((provider, index) => {
        const isConnected = userIntegrations.includes(provider.id);

        return (
          <GridCol key={provider.id} span={4}>
            <form
              action={isConnected ? revokeOauthAction : integrateOauthAction}
            >
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
      })} */}
    </Grid>
  );
};

export default IntegrationCards;
