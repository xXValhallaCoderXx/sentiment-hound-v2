import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
} from "@mantine/core";
import { PackageOpenIcon } from "lucide-react";
import classes from "./MainFeatures.module.css";

const mockdata = [
  {
    title: "Disocver what your users are saying",
    description:
      "Empower your business strategy with real-time insights and data-driven decisions",
    icon: PackageOpenIcon,
  },
  {
    title: "Analyze Historical Data",
    description:
      "Harness the power of historical data to predict future trends and make informed decisions",
    icon: PackageOpenIcon,
  },
  {
    title: "More than just, sentiment analysis",
    description:
      "With aspect based analysis, you can dive deeper into the data and understand the nuances of your users' feedback",
    icon: PackageOpenIcon,
  },
];

const MainFeaturesSection = () => {
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={String(2)}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Integrate effortlessly with most social platforms
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Make data-driven choices with confidence and stay ahead of the curve.
        Experience the power of our sentiment analysis product today and
        revolutionize your decision-making process.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
};

export default MainFeaturesSection;
