import { Box, Flex, Card, Title } from "@mantine/core";

const TrendCards = () => {
  return (
    <Flex gap={16}>
      <Box w="50%">
        <Card withBorder>
          <Title order={4} mb={8}>
            Top 5 Posts
          </Title>
        </Card>
      </Box>
      <Box w="50%">
        <Card withBorder>
          <Title order={4} mb={8}>
            Sentiment Trend
          </Title>
        </Card>
      </Box>
    </Flex>
  );
};

export default TrendCards;
