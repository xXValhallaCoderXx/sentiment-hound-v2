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
} from "@mantine/core";
import { IconBrandGoogle, IconInfoCircle } from "@tabler/icons-react";
import { useState, useEffect, useActionState } from "react";
import { useForm } from "@mantine/form";
import { handleGoogleSignIn, handleEmailSignIn, handleEmailSignUp, handleForgotPassword } from "@/actions/auth.actions";
import { useFormState } from "react-dom";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

type AuthState = "signin" | "signup" | "forgot-password";

interface FormData {
  email: string;
  password: string;
  name?: string;
}

export function AuthModal({ opened, onClose }: AuthModalProps) {
  const [authState, setAuthState] = useState<AuthState>("signin");
  const [isLoading, setIsLoading] = useState(false);

  // Form state for server actions
  const [signInState, signInAction] = useActionState(handleEmailSignIn, null);
  const [signUpState, signUpAction] = useActionState(handleEmailSignUp, null);
  const [forgotPasswordState, forgotPasswordAction] = useActionState(
    handleForgotPassword,
    null
  );

  // Form handling with Mantine form
  const form = useForm<FormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value) ? null : "Please enter a valid email address";
      },
      password: (value) => {
        if (!value) return "Password is required";
        if (authState === "signup" && value.length < 8) {
          return "Password must be at least 8 characters long";
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

  const handleStateChange = (newState: AuthState) => {
    setAuthState(newState);
    form.reset();
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await handleGoogleSignIn();
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    if (data.name) formData.append("name", data.name);

    if (authState === "signin") {
      signInAction(formData);
    } else if (authState === "signup") {
      signUpAction(formData);
    } else if (authState === "forgot-password") {
      forgotPasswordAction(formData);
    }
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

  const getError = () => {
    if (authState === "signin" && signInState?.error) return signInState.error;
    if (authState === "signup" && signUpState?.error) return signUpState.error;
    if (authState === "forgot-password" && forgotPasswordState?.error) return forgotPasswordState.error;
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
      >
        Sign in with Google
      </Button>

      <Divider label="or" labelPosition="center" />

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
            >
              Forgot Password?
            </Anchor>
          </Group>

          <Button type="submit" fullWidth disabled={!form.isValid()}>
            Sign In
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm">
        Don&apos;t have an account?{" "}
        <Anchor
          component="button"
          type="button"
          onClick={() => handleStateChange("signup")}
          fw={500}
        >
          Sign Up
        </Anchor>
      </Text>
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
      >
        Sign up with Google
      </Button>

      <Divider label="or" labelPosition="center" />

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
            placeholder="Create a password"
            required
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <Text size="xs" c="dimmed">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Text>

          <Button type="submit" fullWidth disabled={!form.isValid()}>
            Create Account
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm">
        Already have an account?{" "}
        <Anchor
          component="button"
          type="button"
          onClick={() => handleStateChange("signin")}
          fw={500}
        >
          Sign In
        </Anchor>
      </Text>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <Text size="sm" c="dimmed" ta="center" mb="md">
        Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
      </Text>

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Email address"
            placeholder="your@email.com"
            required
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <Button type="submit" fullWidth disabled={!form.isValid()}>
            Send Reset Link
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm">
        <Anchor
          component="button"
          type="button"
          onClick={() => handleStateChange("signin")}
        >
          Back to Sign In
        </Anchor>
      </Text>
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
      title={getTitle()}
      centered
      size="sm"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="md">
        {getError() && (
          <Alert icon={<IconInfoCircle size={16} />} color="red" variant="light">
            {getError()}
          </Alert>
        )}

        {getSuccess() && (
          <Alert icon={<IconInfoCircle size={16} />} color="green" variant="light">
            {getSuccess()}
          </Alert>
        )}

        {renderForm()}
      </Stack>
    </Modal>
  );
}