"use client";

import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Box,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { IconMail, IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import classes from "./BeFirstToKnowSection.module.css";

interface FormValues {
  email: string;
}

const BeFirstToKnowSection = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just mark as submitted
      // In a real implementation, you would send values.email to your backend
      console.log("Email submitted:", values.email);
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={classes.wrapper}>
        <Container size="md" py="xl">
          <Box ta="center">
            <IconCheck size={64} className={classes.successIcon} />
            <Title order={2} className={classes.title} mt="md" c="text-primary">
              You&apos;re all set!
            </Title>
            <Text size="lg" c="text-secondary" mt="sm">
              We&apos;ll keep you updated on the latest sentiment insights and features.
            </Text>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <Container size="md" py="xl">
        <Stack align="center" gap="xl">
          <Box ta="center" className={classes.content}>
            <Title order={2} className={classes.title} c="text-primary">
              Be first to know
            </Title>
            <Text size="lg" c="text-secondary" mt="sm" className={classes.description}>
              Get early access to new features and stay ahead with the latest sentiment analysis insights.
            </Text>
          </Box>

          <Box className={classes.formWrapper}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Group align="end" className={classes.formGroup}>
                <TextInput
                  placeholder="Enter your email address"
                  leftSection={<IconMail size={16} />}
                  {...form.getInputProps("email")}
                  className={classes.emailInput}
                  size="md"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  loading={loading}
                  size="md"
                  className={classes.submitButton}
                >
                  Notify Me
                </Button>
              </Group>
            </form>

            {error && (
              <Alert
                icon={<IconExclamationCircle size={16} />}
                color="red"
                mt="sm"
                variant="light"
              >
                {error}
              </Alert>
            )}
          </Box>

          <Text size="sm" c="text-secondary" ta="center" className={classes.disclaimer}>
            We respect your privacy. Unsubscribe at any time.
          </Text>
        </Stack>
      </Container>
    </div>
  );
};

export default BeFirstToKnowSection;