import Image from "next/image";
import {
  Text,
  Grid,
  GridCol,
  Card,
  Divider,
  Flex,
  Stack,
  Title,
} from "@mantine/core";
import { getAllProviders } from "@/actions/providers.actions";
import IntegrationButton from "./IntegrationButton";
import {
  getUserIntegrations,
  integrateProvider,
  revokeIntegration,
} from "@/actions/integrations.actions";

const IntegrationCards = async () => {
  const providers = await getAllProviders();

  const userIntegrations = await getUserIntegrations();

  return (
    <Stack>
      <Grid className="mt-4">
        {providers?.data?.map((provider) => {
          const isConnected = userIntegrations?.data?.find(
            (integration) => integration.providerId === provider.id
          );

          return (
            <GridCol key={provider.id} span={4}>
              <form
                action={isConnected ? revokeIntegration : integrateProvider}
              >
                <Card shadow="md">
                  <Flex mb={12} align="center" gap={8}>
                    <Image
                      alt="provider-image"
                      height={35}
                      width={35}
                      src={`/images/logos/${provider?.image}`}
                    />
                    <Text size="lg" fw={500} className="capitalize">
                      {provider.name}
                    </Text>
                  </Flex>
                  <Text size="xs">{provider.description}</Text>
                  <Divider mt={16} />
                  <input type="hidden" name="providerId" value={provider.id} />
                  <IntegrationButton
                    isDisabled={
                      provider.name !== "youtube" && provider.name !== "reddit"
                    }
                    isConnected={Boolean(isConnected?.id)}
                  />
                </Card>
              </form>
            </GridCol>
          );
        })}
      </Grid>
      <Stack>
        <Title order={3} mt={32}>
          Default Integrations
        </Title>
      </Stack>
    </Stack>
  );
};

export default IntegrationCards;
