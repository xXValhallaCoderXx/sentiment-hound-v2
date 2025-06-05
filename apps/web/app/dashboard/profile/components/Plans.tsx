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
  List,
  ThemeIcon,
  Stack,
  Divider,
} from "@mantine/core";
import { FC } from "react";
import { planService } from "@repo/services";
import PlanSubmitButton from "./PlanSubmitButton";
import { IconCheck, IconX } from "@tabler/icons-react";


interface IPlansProps {
  userPlanId: string;
}

const Plans: FC<IPlansProps> = async ({ userPlanId }) => {
  const plans = await planService.getPlans();
  
  const formatPrice = (price?: number) => {
    if (!price || price === 0) return "Free";
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatYearlyDiscount = (monthly?: number, yearly?: number) => {
    if (!monthly || !yearly || yearly === 0) return null;
    const monthlyCost = (monthly * 12) / 100;
    const yearlyCost = yearly / 100;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage > 0 ? `Save ${percentage}% yearly` : null;
  };

  const renderFeatureList = (features: any) => {
    if (!features || typeof features !== 'object') return null;
    
    const featureLabels: Record<string, string> = {
      analytics: "Advanced Analytics",
      exportData: "Data Export",
      apiAccess: "API Access",
      prioritySupport: "Priority Support",
      customIntegrations: "Custom Integrations"
    };

    return (
      <List spacing="xs" size="sm" center>
        {Object.entries(features).map(([key, value]) => (
          <List.Item
            key={key}
            icon={
              <ThemeIcon color={value ? "green" : "gray"} size={16} radius="xl">
                {value ? <IconCheck size={12} /> : <IconX size={12} />}
              </ThemeIcon>
            }
          >
            <Text size="sm" c={value ? "dark" : "dimmed"}>
              {featureLabels[key] || key}
            </Text>
          </List.Item>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <Grid gutter={16} className="mt-4">
        {plans?.map((plan, index) => {
          const isUsersPlan = Number(userPlanId) === plan.id;
          const yearlyDiscount = formatYearlyDiscount(plan.price, plan.yearlyPrice);
          
          return (
            <GridCol span={4} key={index}>
              <Card 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder
                style={{ 
                  height: '100%',
                  border: isUsersPlan ? '2px solid var(--mantine-color-green-6)' : undefined 
                }}
              >
                <form>
                  <CardSection>
                    <Box 
                      style={{ 
                        background: `linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))`,
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text size="xl" fw={700} c="white" tt="capitalize">
                        {plan.name}
                      </Text>
                    </Box>
                  </CardSection>
                  
                  <Stack gap="md" mt="md">
                    <Group justify="space-between" align="flex-start">
                      <Box>
                        <Text size="lg" fw={600}>
                          {formatPrice(plan.price)}
                          {plan.price && plan.price > 0 && (
                            <Text component="span" size="sm" c="dimmed">
                              /month
                            </Text>
                          )}
                        </Text>
                        {yearlyDiscount && (
                          <Text size="xs" c="green" fw={500}>
                            {yearlyDiscount}
                          </Text>
                        )}
                      </Box>
                      <Badge color={isUsersPlan ? "green" : "blue"} variant="filled">
                        {isUsersPlan ? "Current Plan" : "Upgrade"}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed">
                      {plan.description}
                    </Text>

                    <Divider />

                    <Stack gap="xs">
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Integrations:</Text>
                        <Badge size="sm" variant="light">
                          {plan.maxIntegrations === -1 ? "Unlimited" : plan.maxIntegrations}
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Keywords:</Text>
                        <Badge size="sm" variant="light">
                          {plan.maxTrackedKeywords === -1 ? "Unlimited" : plan.maxTrackedKeywords}
                        </Badge>
                      </Group>
                    </Stack>

                    {renderFeatureList(plan.features)}

                    <PlanSubmitButton
                      planId={String(plan.id)}
                      isUsersPlan={isUsersPlan}
                    />
                  </Stack>
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
