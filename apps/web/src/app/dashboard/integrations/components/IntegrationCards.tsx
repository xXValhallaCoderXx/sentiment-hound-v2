import Link from "next/link";
import { Text, Grid, GridCol, Card, Button } from "@mantine/core";
import { providersService, integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";

const IntegrationCards = async () => {
  const session = await auth();
  const providers = await providersService.getProviders();
  const integrations = await integrationsService.getUserIntegrations(
    session?.user?.id as string
  );
  console.log("INT", integrations);
  const userIntegrations = integrations?.map(
    (integration) => integration.providerId
  );

  return (
    <Grid className="mt-4">
      {providers.map((provider, index) => {
        const isConnected = userIntegrations.includes(provider.id);
        const url = isConnected
          ? "/dashboard/integrations"
          : `/api/auth/${provider.name}`;
        return (
          <GridCol key={index} span={3}>
            <Card shadow="md">
              <Text>{provider.name}</Text>
              <Link href={`/api/auth/${provider.name}`}>
                <Button disabled={isConnected}>Connect</Button>
              </Link>
            </Card>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default IntegrationCards;
