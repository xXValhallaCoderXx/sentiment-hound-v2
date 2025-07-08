"use client";

import { Container, Grid, Stack, Anchor, Text, Divider, Alert } from "@mantine/core";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useActionState, useTransition } from "react";
import Link from "next/link";

// Components
import { CardTitle, DimmedText } from "@/components/atoms/Typography/Typography";
import { Logo } from "@/components/atoms/Logo/Logo";
import { Button } from "@/components/atoms/Button/Button";
import { FormField } from "@/components/molecules/FormField/FormField";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { ThemeToggle } from "@/components/molecules/ThemeToggle/ThemeToggle";
import { Card } from "@/components/organisms/Card/Card";
import { RotatingPillarCard } from "@/components/organisms/RotatingPillarCard/RotatingPillarCard";

// Actions
import { handleEmailSignUp, handleGoogleSignInWithToken } from "@/actions/auth.actions";

// Icons
import { IconLock, IconAlertCircle, IconCheck } from "@tabler/icons-react";

// Styles
import classes from "./SignUpPage.module.css";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invitationCode, setInvitationCode] = useState("");
  const [isTokenFromUrl, setIsTokenFromUrl] = useState(false);

  // Server action state
  const [signUpState, signUpAction] = useActionState(handleEmailSignUp, null);
  const [isPending] = useTransition();

  // Get token/code from URL parameters on component mount
  useEffect(() => {
    // Check for both 'token' and 'code' parameters for flexibility
    const token = searchParams.get("token") || searchParams.get("code");
    if (token) {
      setInvitationCode(token);
      setIsTokenFromUrl(true);
    }
  }, [searchParams]);

  // Handle successful signup and redirect
  useEffect(() => {
    if (signUpState?.success && signUpState?.redirectTo) {
      // Show success message briefly, then redirect
      const timer = setTimeout(() => {
        router.push(signUpState.redirectTo);
      }, 2000); // 2 second delay to show success message

      return () => clearTimeout(timer);
    }
  }, [signUpState, router]);

  // Client-side handlers
  const handleGoogleLogin = async () => {
    await handleGoogleSignInWithToken(invitationCode);
  };

  return (
    <div className={classes.pageContainer}>
      {/* Theme Toggle - Subtle positioning */}
      <div className={classes.themeToggleContainer}>
        <ThemeToggle />
      </div>

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
                  <Logo size={40} href="/" showText={true} />

                  {/* Headlines */}
                  <div>
                    <CardTitle mb="xs">Create Your Account</CardTitle>
                    <DimmedText>
                      You&apos;ve been invited! Complete the details below to
                      get started.
                    </DimmedText>
                  </div>

                  {/* Sign Up Form */}
                  <form action={signUpAction}>
                    <Stack gap="md">
                      {/* Success Alert */}
                      {signUpState?.success && (
                        <Alert
                          icon={<IconCheck size={16} />}
                          color="green"
                          variant="light"
                        >
                          {signUpState.message || "Account created successfully!"}
                        </Alert>
                      )}

                      {/* Error Alert */}
                      {signUpState?.error && (
                        <Alert
                          icon={<IconAlertCircle size={16} />}
                          color="red"
                          variant="light"
                        >
                          {signUpState.error}
                        </Alert>
                      )}

                      <FormField
                        type="text"
                        label="Name (Optional)"
                        placeholder="Your full name"
                        name="name"
                      />

                      <FormField
                        type="email"
                        label="Email"
                        placeholder="user@example.com"
                        name="email"
                        required
                      />

                      <FormField
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        required
                      />

                      <FormField
                        type="text"
                        label="Invitation Code"
                        placeholder={isTokenFromUrl ? "Code from invitation link" : "Enter your invitation code"}
                        name="invitationToken"
                        value={invitationCode}
                        onChange={(e) => {
                          if (!isTokenFromUrl) {
                            setInvitationCode(e.target.value);
                          }
                        }}
                        readOnly={isTokenFromUrl}
                        rightSection={isTokenFromUrl ? <IconLock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} /> : undefined}
                        styles={{
                          input: {
                            backgroundColor: isTokenFromUrl ? 'var(--mantine-color-gray-1)' : undefined,
                            cursor: isTokenFromUrl ? 'not-allowed' : undefined,
                          }
                        }}
                      />

                      {/* Create Account Button */}
                      <Button
                        type="submit"
                        fullWidth
                        size="md"
                        variant="filled"
                        loading={isPending}
                        disabled={signUpState?.success}
                      >
                        {signUpState?.success ? "Account Created!" : "Create Account"}
                      </Button>
                    </Stack>
                  </form>

                  {/* Divider */}
                  <Divider label="Or" labelPosition="center" />

                  {/* Social Login */}
                  <SocialLoginButton
                    provider="google"
                    onClick={handleGoogleLogin}
                    loading={false}
                  />

                  {/* Log In Link */}
                  <Text ta="center" size="sm" c="dimmed">
                    Already have an account?{" "}
                    <Anchor
                      component={Link}
                      href="/sign-in"
                      c="primary"
                      fw={500}
                    >
                      Log In
                    </Anchor>
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Brand Pane (Right Column on Desktop) */}
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 2 }}>
              <div className={classes.brandPane}>
                <RotatingPillarCard />
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </Container>
    </div>
  );
}