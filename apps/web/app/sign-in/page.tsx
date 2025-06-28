"use client";

import { useState, useActionState, useTransition } from "react";
import { Container, Grid, Stack, Anchor, Text, Divider, Group, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";

// Actions
import { handleEmailSignIn, handleGoogleSignIn } from "@/actions/auth.actions";

// Components
import { CardTitle, DimmedText } from "@/components/atoms/Typography/Typography";
import { Logo } from "@/components/atoms/Logo/Logo";
import { Button } from "@/components/atoms/Button/Button";
import { FormField } from "@/components/molecules/FormField/FormField";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { Card } from "@/components/organisms/Card/Card";
import { RotatingPillarCard } from "@/components/organisms/RotatingPillarCard/RotatingPillarCard";

// Styles
import classes from "./SignInPage.module.css";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Form state for server actions
  const [signInState, signInAction] = useActionState(handleEmailSignIn, null);
  
  // Form handling with Mantine form
  const form = useForm<SignInFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Please enter a valid email address"),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await handleGoogleSignIn();
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (values: SignInFormData) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      signInAction(formData);
    });
  };

  const getErrorMessage = () => {
    if (signInState?.error) return signInState.error;
    return null;
  };

  return (
    <div className={classes.pageContainer}>
      {/* Living Canvas Background */}
      <div className={classes.livingCanvasBackground}>
        <div className={classes.glow1}></div>
        <div className={classes.glow2}></div>
        <div className={classes.glow3}></div>
      </div>

      {/* Content Layer */}
      <Container size="xl" className={classes.contentContainer}>
        <div className={classes.centeredContent}>
          <Grid gutter="xl" align="center">
            {/* Action Pane (Left Column on Desktop) */}
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 1 }}>
              <Card className={classes.actionCard}>
                <Stack gap="xl">
                  {/* Logo */}
                  <Logo size={48} />
                  
                  {/* Headlines */}
                  <div>
                    <CardTitle mb="xs">Welcome Back</CardTitle>
                    <DimmedText>Enter your credentials to access your dashboard.</DimmedText>
                  </div>

                  {/* Error Alert */}
                  {getErrorMessage() && (
                    <Alert
                      variant="light"
                      color="red"
                      icon={<IconInfoCircle size={16} />}
                    >
                      {getErrorMessage()}
                    </Alert>
                  )}

                  {/* Sign In Form */}
                  <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <Stack gap="md">
                      <FormField
                        type="email"
                        label="Email"
                        placeholder="user@example.com"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                      />

                      <FormField
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                      />

                      {/* Forgot Password Link */}
                      <Group justify="flex-end">
                        <Anchor component={Link} href="/forgot-password" size="sm">
                          Forgot Password?
                        </Anchor>
                      </Group>

                      {/* Log In Button */}
                      <Button
                        type="submit"
                        fullWidth
                        size="md"
                        loading={isPending}
                        variant="filled"
                      >
                        Log In
                      </Button>
                    </Stack>
                  </form>

                  {/* Divider */}
                  <Divider label="Or" labelPosition="center" />

                  {/* Social Login */}
                  <SocialLoginButton
                    provider="google"
                    onClick={handleGoogleLogin}
                    loading={isLoading}
                  />

                  {/* Sign Up Link */}
                  <Text ta="center" size="sm">
                    Don&apos;t have an account?{" "}
                    <Anchor component={Link} href="/#early-access">
                      Join the waitlist
                    </Anchor>
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Brand Pane (Right Column on Desktop) */}
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 2 }}>
              <RotatingPillarCard />
            </Grid.Col>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
