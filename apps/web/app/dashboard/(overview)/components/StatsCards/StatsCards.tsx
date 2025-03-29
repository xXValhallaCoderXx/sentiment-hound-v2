import { Group, Paper, Text, ThemeIcon, SimpleGrid } from "@mantine/core";
import AspectDashboardCard from "@/components/molecules/AspectDasboardCard";
import { IconIceCream, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import classes from "./stats-cards.module.css";

const data = [
  { title: "Positive", value: "1000" },
  { title: "Negative", value: "220" },
  { title: "Neutral usage", value: "500" },
  { title: "N/A", value: "745" },
];

const StatsCards = () => {
  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 4 }}>
        {data?.map((item) => <AspectDashboardCard {...item} />)}
      </SimpleGrid>
    </div>
  );
};

export default StatsCards;


