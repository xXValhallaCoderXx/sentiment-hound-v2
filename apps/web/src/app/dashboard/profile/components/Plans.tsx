"use client";
import { Grid, Card, Text } from "@mantine/core";
import { FC } from "react";
import { Plan } from "database";

interface IPlansProps {
  plans: Plan[];
}
const Plans: FC<IPlansProps> = ({ plans }) => {
  console.log("SERVER PLANS", plans);
  return (
    <Grid>
      {plans?.map((plan, index) => (
        <Grid.Col key={index} span={4}>
          <Card>
            <Card.Section>
              <Text size="xl">{plan.name}</Text>
            </Card.Section>
            <Card.Section>
              <Text size="sm">{plan.description}</Text>
            </Card.Section>
            <Card.Section>
              <Text size="sm"></Text>
            </Card.Section>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default Plans;
