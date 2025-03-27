import { Avatar, Flex, Box, Text, Title, Stack, Skeleton } from "@mantine/core";

const ProfilePageLoading = () => {
  return (
    <Box className="px-6 py-4">
      <Flex className="gap-3">
        <Title>Profile</Title>
        <Skeleton />
      </Flex>
      <Box className="mt-4">
        <Title order={4}>Basic Information</Title>
        <Stack className="mt-2 mb-8">
          <Flex className="items-center gap-2">
            <Title order={6}>Name</Title>
            <Skeleton />
          </Flex>
          <Flex className="items-center gap-2">
            <Title order={6}>Email</Title>
            <Skeleton />
          </Flex>
        </Stack>
      </Box>
      <Title>Plan</Title>
      <Skeleton />
    </Box>
  );
};

export default ProfilePageLoading;
