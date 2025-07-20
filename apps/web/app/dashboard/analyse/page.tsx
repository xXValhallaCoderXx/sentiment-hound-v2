import { auth } from "@/lib/next-auth.lib";
import { Box, Container, Stack, Title, Text } from "@mantine/core";
import AnalyseForm from "./components/AnalyseForm";

const AnalysePage = async () => {
  const session = await auth();

  // Authentication check
  if (!session?.user?.id) {
    return (
      <Container size="sm" py="xl">
        <Box ta="center">
          <Text size="lg" c="dimmed">
            You must be logged in to view this page
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl" align="center">
        {/* Page Header */}
        <Box ta="center">
          <Title order={1} mb="sm">
            Analyze Content
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            Submit a URL from YouTube or other supported platforms to analyze
            sentiment and engagement
          </Text>
        </Box>

        {/* Main Form - No event handlers passed from server component */}
        <AnalyseForm />
      </Stack>
    </Container>
  );
};

export default AnalysePage;
