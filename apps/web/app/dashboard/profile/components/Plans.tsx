import {
  Grid,
  GridCol,
  Card,
  CardSection,
  Text,
  Image,
  Group,
  Badge,
  Box,
} from "@mantine/core";
import { FC } from "react";
import { planService } from "@repo/services";
import PlanSubmitButton from "./PlanSubmitButton";


interface IPlansProps {
  userPlanId: string;
}

const Plans: FC<IPlansProps> = async ({ userPlanId }) => {
  const plans = await planService.getPlans();
  return (
    <Box>
      <Grid gutter={12} className="mt-4">
        {plans?.map((plan, index) => {
          const isUsersPlan = Number(userPlanId) === plan.id; // Placeholder for actual logic
          return (
            <GridCol span={4} key={index}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <form>
                  <CardSection>
                    <Image
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                      height={160}
                      alt="Norway"
                    />
                  </CardSection>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text className="capitalize" fw={500}>
                      {plan.name}
                    </Text>
                    <Badge color={isUsersPlan ? "green" : "yellow"}>
                      {isUsersPlan ? "Active" : "Upgrade"}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {plan.description}
                  </Text>

                  <PlanSubmitButton
                    planId={String(plan.id)}
                    isUsersPlan={isUsersPlan}
                  />
                </form>
              </Card>
            </GridCol>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Plans;
