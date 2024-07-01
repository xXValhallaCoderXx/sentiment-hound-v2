"use client";
import { Title, Box, Text, Grid, GridCol, Card, Button } from "@mantine/core";
const IntegrationsPage = () => {
  const handleYouTubeIntegration = () => {
    window.location.href = "/api/auth/youtube";
  };
  return (
    <div className="h-full ">
      <Box className="px-4">
        <Title>Integrations</Title>
        <Text>Choose from a range of different ones</Text>
        <Grid className="mt-4">
          <GridCol span={3}>
            <Card shadow="md">
              <Text>Youtube</Text>

              <Button onClick={handleYouTubeIntegration}>Connect</Button>
            </Card>
          </GridCol>
          <GridCol span={3}>
            <Card shadow="md">
              <Text>Youtube</Text>
            </Card>
          </GridCol>
          <GridCol span={3}>
            <Card shadow="md">
              <Text>Youtube</Text>
            </Card>
          </GridCol>
        </Grid>
      </Box>
    </div>
  );
};

export default IntegrationsPage;
