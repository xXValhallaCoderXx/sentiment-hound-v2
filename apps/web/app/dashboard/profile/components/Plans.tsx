import {
  Grid,
  GridCol,
  Card,
  CardSection,
  Text,
  Image,
  Group,
  Badge,
} from "@mantine/core";
import { FC } from "react";
import { Plan } from "database";
import { upgradePlanAction } from "@/slice/plans/actions";
import PlanSubmitButton from "./PlanSubmitButton";
interface IPlansProps {
  plans: Plan[];
  userPlan: Plan | null | undefined;
}
const Plans: FC<IPlansProps> = ({ plans, userPlan }) => {
  return (
    <Grid className="mt-4">
      {plans?.map((plan, index) => {
        const isUsersPlan = userPlan?.id === plan.id;
        return (
          <GridCol span={4} key={index}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <form action={upgradePlanAction}>
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

                <PlanSubmitButton isUsersPlan={isUsersPlan} />

                <input type="hidden" name="planId" value={plan.id} />
              </form>
            </Card>
          </GridCol>
        );
      })}
    </Grid>
  );
};

export default Plans;
