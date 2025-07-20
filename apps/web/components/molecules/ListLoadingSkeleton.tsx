import { FC } from "react";
import { Skeleton, Card, Grid, GridCol, Flex, Stack, Box } from "@mantine/core";

interface ListLoadingSkeletonProps {
  /** Number of skeleton items to display */
  itemCount?: number;
  /** Layout type - grid for card layout, list for table-like layout */
  layout?: "grid" | "list";
  /** Number of columns for grid layout */
  gridCols?: { base?: number; sm?: number; md?: number; lg?: number };
  /** Show page title skeleton */
  showTitle?: boolean;
  /** Show action button skeleton (e.g., "Add New" button) */
  showActionButton?: boolean;
}

const ListLoadingSkeleton: FC<ListLoadingSkeletonProps> = ({
  itemCount = 4,
  layout = "grid",
  gridCols = { base: 12, sm: 6, md: 4 },
  showTitle = true,
  showActionButton = true,
}) => {
  if (layout === "list") {
    return (
      <Stack gap="md">
        {showTitle && <Skeleton height={32} width={200} />}
        {showActionButton && <Skeleton height={36} width={120} />}
        <Stack gap="sm">
          {Array(itemCount)
            .fill(0)
            .map((_, i) => (
              <Card key={i} withBorder p="md">
                <Flex align="center" gap="md">
                  <Skeleton height={40} circle />
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={12} width="40%" />
                  </Stack>
                  <Skeleton height={32} width={80} />
                </Flex>
              </Card>
            ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {showTitle && <Skeleton height={32} width={200} />}
      {showActionButton && <Skeleton height={36} width={120} />}
      <Grid>
        {Array(itemCount)
          .fill(0)
          .map((_, i) => (
            <GridCol key={i} span={gridCols}>
              <Card shadow="md" withBorder>
                <Flex align="center" mb={12} gap={8}>
                  <Skeleton height={35} circle />
                  <Skeleton height={24} width="60%" />
                </Flex>
                <Skeleton height={14} width="80%" mb={16} />
                <Box
                  style={{ borderTop: "1px solid #e9ecef", marginBottom: 16 }}
                />
                <Skeleton height={36} />
              </Card>
            </GridCol>
          ))}
      </Grid>
    </Stack>
  );
};

export default ListLoadingSkeleton;
