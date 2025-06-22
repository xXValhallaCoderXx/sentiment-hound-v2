"use client";

import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  Group,
  Grid,
  GridCol,
  ThemeIcon,
  Paper,
  Badge,
  Stack,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useActionState } from "react";
import {
  IconDiscount,
  IconRocket,
  IconFlask,
  IconArrowRight,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { handleEarlyAccessSignup } from "@/actions/early-access.actions";
import classes from "./BeFirstToKnowSection.module.css";

interface FormValues {
  name?: string;
  email: string;
}

const BeFirstToKnowSection = () => {
  const [state, formAction] = useActionState(handleEarlyAccessSignup, null);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email address",
      name: (value) =>
        value && value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  // Disable form if already successfully submitted or if email already exists
  const isDisabled = state?.success || state?.alreadyExists;

  const benefits = [
    {
      icon: IconDiscount,
      title: "Exclusive lifetime discount",
      description: "Lock in special 'Good Dog' pricing before public launch",
      color: "red",
    },
    {
      icon: IconRocket,
      title: "Priority onboarding",
      description: "Priority onboarding when we unleash the alpha",
      color: "blue",
    },
    {
      icon: IconFlask,
      title: "Access to the latest features",
      description: "A direct line to influence new features",
      color: "green",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="lg" py="xl">
        <div className={classes.content}>
          <div className={classes.header}>
            <Badge
              variant="gradient"
              gradient={{ from: "red", to: "pink" }}
              size="lg"
              className={classes.badge}
            >
              ⭐ Early Pup Access
            </Badge>

            <Title order={2} className={classes.title}>
              Be the first to know.
            </Title>

            <Text className={classes.subtitle}>
              Join the wait-list and lock in. Show your interest and start
              digging as soon as our pups are ready.
            </Text>
          </div>

          <Grid gutter="xl" align="stretch" className={classes.mainContent}>
            <GridCol span={{ base: 12, md: 7 }}>
              <div className={classes.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <Paper key={index} className={classes.benefitCard} p="md">
                    <Group gap="sm" align="flex-start">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color={benefit.color}
                        className={classes.benefitIcon}
                      >
                        <benefit.icon size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600} className={classes.benefitTitle}>
                          {benefit.title}
                        </Text>
                        <Text
                          size="sm"
                          c="dimmed"
                          className={classes.benefitDescription}
                        >
                          {benefit.description}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </div>
            </GridCol>

            <GridCol span={{ base: 12, md: 5 }}>
              <Paper className={classes.formCard} p="xl">
                <form action={formAction}>
                  <Stack gap="md">
                    <TextInput
                      name="name"
                      placeholder="Enter your name (optional)"
                      {...form.getInputProps("name")}
                      className={classes.input}
                      disabled={isDisabled}
                    />

                    <TextInput
                      name="email"
                      placeholder="Enter your email address"
                      required
                      {...form.getInputProps("email")}
                      className={classes.input}
                      disabled={isDisabled}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      rightSection={<IconArrowRight size={16} />}
                      disabled={isDisabled}
                    >
                      {state?.success
                        ? "You're In! 🎉"
                        : state?.alreadyExists
                          ? "Already Signed Up ✓"
                          : "Claim Your Spot"}
                    </Button>

                    {state?.error && !state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="red"
                        icon={<IconInfoCircle size={16} />}
                      >
                        {state.error}
                      </Alert>
                    )}

                    {state?.error && state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="blue"
                        icon={<IconCheck size={16} />}
                      >
                        {state.error}
                      </Alert>
                    )}

                    {state?.success && !state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="green"
                        icon={<IconCheck size={16} />}
                      >
                        {state.message ||
                          "Success! You've been added to our early access list."}
                      </Alert>
                    )}

                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                      className={classes.disclaimer}
                    >
                      🔒 No spam. No fluff. Just early access to insights that
                      matter.
                    </Text>
                  </Stack>
                </form>
              </Paper>
            </GridCol>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default BeFirstToKnowSection;
