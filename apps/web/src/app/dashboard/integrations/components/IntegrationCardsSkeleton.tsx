import { Skeleton, Card, Grid, GridCol } from "@mantine/core";

const IntegrationCardsSkeleton = () => {
  return (
    <Grid>
      <GridCol span={3}>
        <Card shadow="md">
          <Skeleton height={30} radius="sm" />
        </Card>
      </GridCol>
      <GridCol span={3}>
        <Card shadow="md">
          <Skeleton height={30} radius="sm" />
        </Card>
      </GridCol>
      <GridCol span={3}>
        <Card shadow="md">
          <Skeleton height={30} radius="sm" />
        </Card>
      </GridCol>
    </Grid>
  );
};

export default IntegrationCardsSkeleton;
