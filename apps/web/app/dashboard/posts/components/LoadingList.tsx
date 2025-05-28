import { Box, Skeleton } from "@mantine/core";

const LoadingList = () => {
  return (
    <Box className="mt-4">
      <Skeleton height={40} radius="sm" mb="md" />
      <Skeleton height={400} radius="sm" />
    </Box>
  );
};

export default LoadingList;
