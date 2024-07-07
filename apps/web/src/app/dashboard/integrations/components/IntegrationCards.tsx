import { Text, Grid, GridCol, Card, Button } from "@mantine/core";
import { providersService, integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";
import IntegrationButton from "./IntegrationButton";
import { integrateOauthAction, revokeOauthAction } from "../actions";

const IntegrationCards = async () => {
  const session = await auth();
  const providers = await providersService.getProviders();
  const integrations = await integrationsService.getUserIntegrations(
    session?.user?.id as string
  );

  const userIntegrations = integrations?.map(
    (integration) => integration.providerId
  );

  return (
    <Grid className="mt-4">
      {providers.map((provider, index) => {
        const isConnected = userIntegrations.includes(provider.id);

        return (
          <GridCol key={provider.id} span={3}>
            <form
              action={isConnected ? revokeOauthAction : integrateOauthAction}
            >
              <Card shadow="md">
                <Text>{provider.name}s</Text>
                <input type="hidden" name="providerId" value={provider.id} />
                <IntegrationButton isConnected={isConnected} />
              </Card>
            </form>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default IntegrationCards;
