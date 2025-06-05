import { SimpleGrid, Card, Title, Flex } from "@mantine/core";
import { LineChart, PieChart } from "@mantine/charts";

const TrendCards = () => {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={16}>
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={8}>
          Sentiment Trend
        </Title>
        <LineChart
          h={250}
          data={Linedata}
          withLegend
          dataKey="date"
          series={[
            { name: "Positive", color: "indigo.6" },
            { name: "Negative", color: "blue.6" },
            { name: "Neutral", color: "teal.6" },
          ]}
          curveType="linear"
        />
      </Card>
      <Card withBorder p={{ base: 12, sm: 16 }}>
        <Title order={4} mb={8}>
          Sentiment Overview
        </Title>
        <Flex justify="center">
          <PieChart
            withLabels
            // tooltipDataSource="segment"
            labelsType="percent"
            withTooltip
            h={250}
            data={donutData}
          />
        </Flex>
      </Card>
    </SimpleGrid>
  );
};

export default TrendCards;

export const donutData = [
  { name: "USA", value: 400, color: "indigo.6" },
  { name: "India", value: 300, color: "yellow.6" },
  { name: "Japan", value: 100, color: "teal.6" },
  { name: "Other", value: 200, color: "gray.6" },
];

const Linedata = [
  {
    date: "Mar 22",
    Positive: 2890,
    Negative: 2338,
    Neutral: 2452,
  },
  {
    date: "Mar 23",
    Positive: 2756,
    Negative: 2103,
    Neutral: 2402,
  },
  {
    date: "Mar 24",
    Positive: 3322,
    Negative: 986,
    Neutral: 1821,
  },
  {
    date: "Mar 25",
    Positive: 3470,
    Negative: 2108,
    Neutral: 2809,
  },
  {
    date: "Mar 26",
    Positive: 3129,
    Negative: 1726,
    Neutral: 2290,
  },
];
