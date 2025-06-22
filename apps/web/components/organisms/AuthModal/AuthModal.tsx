"use client";

import {
  Modal,
  Stack,
  Text,
  Button,
  TextInput,
  PasswordInput,
  Divider,
  Group,
  Alert,
  Anchor,
  Collapse,
  Card,
  Title,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { 
  IconBrandGoogle, 
  IconInfoCircle, 
  IconGift,
  IconSparkles,
  IconCheck,
} from "@tabler/icons-react";
import { useState, useEffect, useActionState, useTransition } from "react";
import { useForm } from "@mantine/form";
import {
  handleGoogleSignIn,
  handleEmailSignIn,
  handleEmailSignUp,
  handleForgotPassword,
} from "@/actions/auth.actions";
import {
  getInvitationCodeFromUrl,
  setInvitationCodeInStorage,
  validateInvitationCodeFormat,
} from "@/lib/invitation-code.utils";
import classes from "./AuthModal.module.css";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

type AuthState = "signin" | "signup" | "forgot-password";

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  invitationCode?: string;
}

export function AuthModal({ opened, onClose }: AuthModalProps) {
  const [authState, setAuthState] = useState<AuthState>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showInvitationCode, setShowInvitationCode] = useState(false);
  const [invitationCodeApplied, setInvitationCodeApplied] = useState(false);
  const [pendingInvitationCode, setPendingInvitationCode] =
    useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Form state for server actions
  const [signInState, signInAction] = useActionState(handleEmailSignIn, null);
  const [signUpState, signUpAction] = useActionState(handleEmailSignUp, null);
  const [forgotPasswordState, forgotPasswordAction] = useActionState(
    handleForgotPassword,
    null
  );

  // Form handling with Mantine form
  const form = useForm<AuthFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
      invitationCode: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value)
          ? null
          : "Please enter a valid email address";
      },
      password: (value) => {
        if (!value) return "Password is required";
        if (authState === "signup" && value.length < 8) {
          return "Password must be at least 8 characters long";
        }
        return null;
      },
      invitationCode: (value) => {
        if (value && !validateInvitationCodeFormat(value)) {
          return "Invalid invitation code format";
        }
        return null;
      },
    },
  });

  // Close modal on successful auth
  useEffect(() => {
    if (signInState?.success || signUpState?.success) {
      onClose();
    }
  }, [signInState?.success, signUpState?.success, onClose]);

  // Check for invitation code in URL on component mount
  useEffect(() => {
    const urlCode = getInvitationCodeFromUrl();
    if (urlCode && validateInvitationCodeFormat(urlCode)) {
      form.setFieldValue("invitationCode", urlCode);
      setPendingInvitationCode(urlCode);
      setInvitationCodeApplied(true);
      setShowInvitationCode(true);
    }
  }, [form]);

  const handleStateChange = (newState: AuthState) => {
    setAuthState(newState);
    form.reset();
    // Keep invitation code if already applied
    if (invitationCodeApplied && pendingInvitationCode) {
      form.setFieldValue("invitationCode", pendingInvitationCode);
    }
  };

  const handleApplyInvitationCode = () => {
    const code = form.getValues().invitationCode;
    if (code && validateInvitationCodeFormat(code)) {
      setPendingInvitationCode(code);
      setInvitationCodeApplied(true);
      setInvitationCodeInStorage(code);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Store invitation code before OAuth redirect
      if (pendingInvitationCode) {
        setInvitationCodeInStorage(pendingInvitationCode);
      }
      await handleGoogleSignIn();
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: AuthFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    if (data.name) formData.append("name", data.name);
    if (data.invitationCode)
      formData.append("invitationCode", data.invitationCode);
    console.log("AUTH STATE: ", authState);
    startTransition(() => {
      if (authState === "signin") {
        signInAction(formData);
      } else if (authState === "signup") {
        signUpAction(formData);
      } else if (authState === "forgot-password") {
        forgotPasswordAction(formData);
      }
    });
  };

  const getTitle = () => {
    switch (authState) {
      case "signin":
        return "Welcome back";
      case "signup":
        return "Create Your Account";
      case "forgot-password":
        return "Reset Password";
    }
  };

  const getSubtitle = () => {
    switch (authState) {
      case "signin":
        return "Sign in to your account to continue";
      case "signup":
        return "Join thousands of users tracking sentiment";
      case "forgot-password":
        return "We'll send you a link to reset your password";
    }
  };

  const getError = () => {
    if (authState === "signin" && signInState?.error) return signInState.error;
    if (authState === "signup" && signUpState?.error) return signUpState.error;
    if (authState === "forgot-password" && forgotPasswordState?.error)
      return forgotPasswordState.error;
    return null;
  };

  const getSuccess = () => {
    if (authState === "forgot-password" && forgotPasswordState?.success) {
      return forgotPasswordState.message;
    }
    return null;
  };

  const renderSignInForm = () => (
    <>
      <Button
        leftSection={<IconBrandGoogle size={16} />}
        variant="default"
        size="md"
        fullWidth
        onClick={handleGoogleAuth}
        loading={isLoading}
        className={classes.googleButton}
      >
        Sign in with Google
      </Button>

      <Divider
        label="or"
        labelPosition="center"
        classNames={{
          label: classes.dividerLabel,
        }}
      />

      <Card className={classes.formCard}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Email address"
              placeholder="your@email.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <Group justify="flex-end">
              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => handleStateChange("forgot-password")}
                className={classes.switchLink}
              >
                Forgot Password?
              </Anchor>
            </Group>

            <Button
              type="submit"
              fullWidth
              disabled={!form.isValid()}
              loading={isPending}
              className={classes.primaryButton}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Card>

      <div className={classes.switchText}>
        <Text size="sm">
          Don&apos;t have an account?{" "}
          <Anchor
            component="button"
            type="button"
            onClick={() => handleStateChange("signup")}
            className={classes.switchLink}
          >
            Sign Up
          </Anchor>
        </Text>
      </div>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <Button
        leftSection={<IconBrandGoogle size={16} />}
        variant="default"
        size="md"
        fullWidth
        onClick={handleGoogleAuth}
        loading={isLoading}
        className={classes.googleButton}
      >
        Sign up with Google
      </Button>

      <Divider
        label="or"
        labelPosition="center"
        classNames={{
          label: classes.dividerLabel,
        }}
      />

      {/* Enhanced Invitation Code Section */}
      <Card className={classes.invitationCodeCard}>
        <div className={classes.invitationHeader}>
          <ThemeIcon className={classes.invitationIcon} size="sm" radius="sm">
            <IconGift size={16} />
          </ThemeIcon>
          <Text fw={600} size="sm">
            Have an invitation code?
          </Text>
          {!showInvitationCode && !invitationCodeApplied && (
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setShowInvitationCode(true)}
              className={classes.invitationToggle}
              ml="auto"
            >
              Add Code
            </Button>
          )}
        </div>

        {invitationCodeApplied && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            variant="light"
            className={classes.appliedCodeAlert}
            mb="sm"
          >
            <Text size="sm" fw={500}>
              Invitation code applied! You&apos;ll get special access.
            </Text>
            <div className={classes.featuresGrid}>
              <div className={classes.featureItem}>
                <IconSparkles size={14} className={classes.featureIcon} />
                <Text size="xs">Enhanced features</Text>
              </div>
              <div className={classes.featureItem}>
                <IconCheck size={14} className={classes.featureIcon} />
                <Text size="xs">Premium access</Text>
              </div>
            </div>
          </Alert>
        )}

        <Collapse in={showInvitationCode && !invitationCodeApplied}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed">
              Enter your invitation code to unlock special features and enhanced
              access.
            </Text>
            <Group gap="xs">
              <TextInput
                placeholder="Enter invitation code (e.g., EARLYBIRD2025)"
                key={form.key("invitationCode")}
                {...form.getInputProps("invitationCode")}
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleApplyInvitationCode}
                disabled={!form.getValues().invitationCode}
                className={classes.applyCodeButton}
              >
                Apply
              </Button>
            </Group>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setShowInvitationCode(false)}
              c="dimmed"
            >
              I don&apos;t have a code
            </Button>
          </Stack>
        </Collapse>
      </Card>

      <Card className={classes.formCard}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name (optional)"
              placeholder="Your name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email address"
              placeholder="your@email.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password (min. 8 characters)"
              required
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <Text size="xs" c="dimmed">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </Text>

            <Button
              type="submit"
              fullWidth
              disabled={!form.isValid() || isPending}
              loading={isPending}
              className={classes.primaryButton}
            >
              Create Account
            </Button>
          </Stack>
        </form>
      </Card>

      <div className={classes.switchText}>
        <Text size="sm">
          Already have an account?{" "}
          <Anchor
            component="button"
            type="button"
            onClick={() => handleStateChange("signin")}
            className={classes.switchLink}
          >
            Sign In
          </Anchor>
        </Text>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <Text size="sm" className={classes.subtitle} ta="center" mb="md">
        Enter the email address associated with your account, and we&apos;ll
        send you a link to reset your password.
      </Text>

      <Card className={classes.formCard}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Email address"
              placeholder="your@email.com"
              required
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <Button
              type="submit"
              fullWidth
              disabled={!form.isValid()}
              loading={isPending}
              className={classes.primaryButton}
            >
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Card>

      <div className={classes.switchText}>
        <Text size="sm">
          <Anchor
            component="button"
            type="button"
            onClick={() => handleStateChange("signin")}
            className={classes.switchLink}
          >
            Back to Sign In
          </Anchor>
        </Text>
      </div>
    </>
  );

  const renderForm = () => {
    switch (authState) {
      case "signin":
        return renderSignInForm();
      case "signup":
        return renderSignUpForm();
      case "forgot-password":
        return renderForgotPasswordForm();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 8,
      }}
      classNames={{
        content: classes.modalContent,
      }}
    >
      <Stack gap="lg" align="center" p="md">
        {/* Header */}
        <Stack gap="xs" align="center">
          <ThemeIcon
            size={rem(60)}
            radius="xl"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            <IconSparkles size={rem(30)} />
          </ThemeIcon>
          <Title className={classes.title} ta="center" size="h2">
            {getTitle()}
          </Title>
          <Text size="sm" className={classes.subtitle} ta="center">
            {getSubtitle()}
          </Text>
        </Stack>

        {/* Alerts */}
        {getError() && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="red"
            variant="light"
            w="100%"
          >
            {getError()}
          </Alert>
        )}

        {getSuccess() && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="green"
            variant="light"
            w="100%"
          >
            {getSuccess()}
          </Alert>
        )}

        {/* Form Content */}
        <Stack gap="lg" w="100%">
          {renderForm()}
        </Stack>
      </Stack>
    </Modal>
  );
}