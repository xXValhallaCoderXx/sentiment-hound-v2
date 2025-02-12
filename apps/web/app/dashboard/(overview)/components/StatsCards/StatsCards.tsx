import { Group, Paper, Text, ThemeIcon, SimpleGrid } from "@mantine/core";
import { IconIceCream2 } from "@tabler/icons-react";
import classes from "./stats-cards.module.css";

const data = [
  { title: "Revenue", value: "$13,456", diff: 34 },
  { title: "Profit", value: "$4,145", diff: -13 },
  { title: "Coupons usage", value: "745", diff: 18 },
];

const StatsCards = () => {
  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconIceCream2 : IconIceCream2;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text
              c="dimmed"
              tt="uppercase"
              fw={700}
              fz="xs"
              className={classes.label}
            >
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color:
                stat.diff > 0
                  ? "var(--mantine-color-teal-6)"
                  : "var(--mantine-color-red-6)",
            }}
            size={38}
            radius="md"
          >
            <DiffIcon size="1.8rem" />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={stat.diff > 0 ? "teal" : "red"} fw={700}>
            {stat.diff}%
          </Text>{" "}
          {stat.diff > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
    </div>
  );
};

export default StatsCards;
