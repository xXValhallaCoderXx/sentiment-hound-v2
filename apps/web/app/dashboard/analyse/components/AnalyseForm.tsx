"use client";

import React from "react";
import { Card, Title, Text, Stack, TextInput, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAnalyseForm } from "@/hooks/useAnalyseForm";
import { startAnalysis } from "@/actions/analysis.actions";
import classes from "./AnalyseForm.module.css";

export interface AnalyseFormProps {
  /** Optional class name for styling */
  className?: string;
}

const AnalyseForm: React.FC<AnalyseFormProps> = React.memo(({ className }) => {
  const { state, actions } = useAnalyseForm();
  const router = useRouter();

  // Internal success handler
  const handleSuccess = () => {
    console.log("Analysis submitted successfully");
  };

  // Internal error handler
  const handleError = (error: string) => {
    console.error("Analysis submission error:", error);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    actions.setUrl(event.target.value);
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (!state.isValid || state.isLoading) {
      return;
    }

    try {
      actions.setLoading(true);
      actions.resetError();
      console.log("Submitting analysis for URL:", state.url);
      const result = await startAnalysis(state.url);
      console.log("Analysis result:", result);
      if (result.error) {
        const errorMessage =
          result.error.error || "An error occurred while starting analysis";
        actions.setError(errorMessage);
        handleError(errorMessage);

        // Show error notification
        notifications.show({
          title: "Analysis Failed",
          message: errorMessage,
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      } else {
        // Success handling - clear form first
        actions.clearForm();
        handleSuccess();

        // Show success notification
        notifications.show({
          title: "Analysis Started",
          message: "Your content analysis has been initiated successfully",
          color: "green",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });

        // Redirect to dashboard after 2-second delay (after notification auto-close)
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

        console.log("Analysis started successfully:", result.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      actions.setError(errorMessage);
      handleError(errorMessage);

      // Show error notification for exceptions
      notifications.show({
        title: "Unexpected Error",
        message: errorMessage,
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    } finally {
      actions.setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && state.isValid && !state.isLoading) {
      handleSubmit();
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={`${classes.card} ${className || ""}`}
      role="form"
      aria-labelledby="analyse-form-title"
      aria-describedby="analyse-form-description"
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="lg" className={classes.formContainer}>
          <div className={classes.header}>
            <Title order={1} className={classes.title} id="analyse-form-title">
              Analyze a New Post
            </Title>
            <Text
              className={classes.subtitle}
              id="analyse-form-description"
              c="dimmed"
            >
              Paste a URL from a supported platform to begin sentiment analysis
            </Text>
          </div>

          <TextInput
            placeholder="https://www.youtube.com/watch?v=..."
            label="Post URL"
            description="Enter a URL from YouTube or other supported social media platforms"
            size="lg"
            value={state.url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            disabled={state.isLoading}
            error={state.error}
            className={classes.inputField}
            required
            autoComplete="url"
            aria-describedby={state.error ? "url-error" : undefined}
            styles={{
              input: {
                fontSize: "16px",
                minHeight: "48px", // Touch-friendly minimum height
              },
              label: {
                fontSize: "16px",
                fontWeight: 600,
              },
              description: {
                fontSize: "14px",
              },
            }}
          />

          <Button
            type="submit"
            size="lg"
            disabled={!state.isValid || state.isLoading}
            loading={state.isLoading}
            className={classes.submitButton}
            aria-describedby="submit-button-description"
            styles={{
              root: {
                minHeight: "48px", // Touch-friendly minimum height
                fontSize: "16px",
              },
            }}
          >
            Start Analysis
          </Button>

          {/* Screen reader helper text */}
          <div id="submit-button-description" className={classes.srOnly}>
            {state.isLoading
              ? "Analysis is being submitted, please wait"
              : state.isValid
                ? "Click to start analyzing the entered URL"
                : "Enter a valid URL to enable analysis"}
          </div>
        </Stack>
      </form>
    </Card>
  );
});

// Set display name for debugging and React DevTools
AnalyseForm.displayName = "AnalyseForm";

export default AnalyseForm;
