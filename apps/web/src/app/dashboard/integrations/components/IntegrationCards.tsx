"use client";
import { FC } from "react";
import { Text, Grid, GridCol, Card, Button } from "@mantine/core";
import { Integration, Provider } from "database";

interface IIntegrationCardsProps {
  providers: Provider[];
  integrations: Integration[];
}

const IntegrationCards: FC<IIntegrationCardsProps> = ({ providers }) => {
  const handleYouTubeIntegration = () => {
    window.location.href = "/api/auth/youtube";
  };
  return (
    <div>
      <Grid className="mt-4">
        {providers.map((provider, index) => (
          <GridCol key={index} span={3}>
            <Card shadow="md">
              <Text>{provider.name}</Text>

              <Button onClick={handleYouTubeIntegration}>Connect</Button>
            </Card>
          </GridCol>
        ))}
      </Grid>
    </div>
  );
};

export default IntegrationCards;
