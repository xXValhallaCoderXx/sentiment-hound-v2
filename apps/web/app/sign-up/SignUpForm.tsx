"use client";

import { Container, Grid, Stack, Anchor, Text, Divider } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

// Icons
import { IconLock } from "@tabler/icons-react";

// Styles
import classes from "./SignUpPage.module.css";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const [invitationCode, setInvitationCode] = useState("");
  const [isTokenFromUrl, setIsTokenFromUrl] = useState(false);

  // Get token/code from URL parameters on component mount
  useEffect(() => {
    // Check for both 'token' and 'code' parameters for flexibility
    const token = searchParams.get("token") || searchParams.get("code");
    if (token) {
      setInvitationCode(token);
      setIsTokenFromUrl(true);
    }
  }, [searchParams]);

  // Client-side handlers
  const handleGoogleLogin = () => {
    // Static UI - no functionality needed per PRD
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static UI - no functionality needed per PRD
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
                  <form onSubmit={handleFormSubmit}>
                    <Stack gap="md">
                      <FormField
                        type="email"
                        label="Email"
                        placeholder="user@example.com"
                      />

                      <FormField
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                      />

                      <FormField
                        type="text"
                        label="Invitation Code"
                        placeholder={isTokenFromUrl ? "Code from invitation link" : "Enter your invitation code"}
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
                      >
                        Create Account (Coming Soon)
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