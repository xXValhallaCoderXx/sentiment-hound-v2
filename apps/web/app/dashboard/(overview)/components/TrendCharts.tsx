import { Box, Flex, Card, Title } from "@mantine/core";
import { LineChart, PieChart } from "@mantine/charts";

const TrendCards = () => {
  return (
    <Flex gap={16}>
      <Box w="50%">
        <Card withBorder>
          <Title order={4} mb={8}>
            Sentiment Trend
          </Title>
          <LineChart
            h={300}
            data={Linedata}
            dataKey="date"
            series={[
              { name: "Apples", color: "indigo.6" },
              { name: "Oranges", color: "blue.6" },
              { name: "Tomatoes", color: "teal.6" },
            ]}
            curveType="linear"
          />
        </Card>
      </Box>
      <Box w="50%">
        <Card withBorder>
          <Title order={4} mb={8}>
            Sentiment Overview
          </Title>
          <PieChart h={300} data={donutData} />
        </Card>
      </Box>
    </Flex>
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
    Apples: 2890,
    Oranges: 2338,
    Tomatoes: 2452,
  },
  {
    date: "Mar 23",
    Apples: 2756,
    Oranges: 2103,
    Tomatoes: 2402,
  },
  {
    date: "Mar 24",
    Apples: 3322,
    Oranges: 986,
    Tomatoes: 1821,
  },
  {
    date: "Mar 25",
    Apples: 3470,
    Oranges: 2108,
    Tomatoes: 2809,
  },
  {
    date: "Mar 26",
    Apples: 3129,
    Oranges: 1726,
    Tomatoes: 2290,
  },
];