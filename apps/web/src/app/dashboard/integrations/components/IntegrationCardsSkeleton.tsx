import { Skeleton, Card, Grid, GridCol, Flex, Divider } from "@mantine/core";

const IntegrationCardsSkeleton = () => {
  return (
    <Grid>
      <GridCol span={4}>
        <SkeletonCard />
      </GridCol>
      <GridCol span={4}>
        <SkeletonCard />
      </GridCol>
      <GridCol span={4}>
        <SkeletonCard />
      </GridCol>
    </Grid>
  );
};

const SkeletonCard = () => (
  <Card shadow="md">
    <Flex align="center" mb={-20} gap={10}>
      <Skeleton height={40} circle mb="xl" />
      <Skeleton height={29} width={100} mt={-30} radius="sm" />
    </Flex>
    <Skeleton width="80%" height={33.6} radius="sm" />
    <Divider className="mt-4" />

    <Skeleton className="mt-4" height={36} radius="sm" />
  </Card>
);

export default IntegrationCardsSkeleton;
