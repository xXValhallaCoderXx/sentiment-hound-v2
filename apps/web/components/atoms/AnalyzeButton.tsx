"use client";

import { useState } from "react";
import {
  Button,
  TextInput,
  Paper,
  Text,
  Alert,
  Group,
  Stack,
} from "@mantine/core";
import { IconAnalyze, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { startAnalysis } from "@/actions/analysis.actions";
import { ActionResponse } from "@/lib/types";

interface AnalyzeButtonProps {
  /**
   * Optional callback when analysis is successfully started
   */
  onAnalysisStarted?: (taskId: number) => void;
  /**
   * Custom placeholder text for the URL input
   */
  placeholder?: string;
  /**
   * Whether to show the component in a compact layout
   */
  compact?: boolean;
}

type AnalysisResult = {
  taskId: number;
  status: string;
};

/**
 * AnalyzeButton Component
 *
 * A reusable component that provides a URL input field and analyze button
 * for starting sentiment analysis tasks. Handles loading states, error display,
 * and success messaging with task tracking.
 */
export default function AnalyzeButton({
  onAnalysisStarted,
  placeholder = "Enter YouTube or Reddit URL to analyze...",
  compact = false,
}: AnalyzeButtonProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ActionResponse<AnalysisResult> | null>(
    null
  );

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setResult({
        data: null,
        error: {
          error: "Please enter a valid URL",
          code: "VALIDATION_ERROR",
          status: 400,
        },
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await startAnalysis(url.trim());
      setResult(response);

      if (response.data && onAnalysisStarted) {
        onAnalysisStarted(response.data.taskId);
      }

      // Clear the input on success
      if (response.data) {
        setUrl("");
      }
    } catch {
      setResult({
        data: null,
        error: {
          error: "An unexpected error occurred. Please try again.",
          code: "UNKNOWN_ERROR",
          status: 500,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isLoading) {
      handleAnalyze();
    }
  };

  const getErrorMessage = (code: string, message: string): string => {
    switch (code) {
      case "UNAUTHORIZED":
        return "Please sign in to analyze content.";
      case "URL_INVALID":
        return "Please enter a valid YouTube or Reddit URL.";
      case "AUTH_UNAVAILABLE":
        return "Analysis for this platform is temporarily unavailable. Please try again later.";
      case "INTEGRATION_INACTIVE":
        return "Your integration is inactive. Please reconnect your account in settings.";
      case "DATABASE_ERROR":
        return "Service temporarily unavailable. Please try again in a few moments.";
      case "VALIDATION_ERROR":
        return message;
      default:
        return message || "Something went wrong. Please try again.";
    }
  };

  if (compact) {
    return (
      <Stack gap="xs">
        <Group gap="xs">
          <TextInput
            value={url}
            onChange={(event) => setUrl(event.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            style={{ flex: 1 }}
            disabled={isLoading}
          />
          <Button
            onClick={handleAnalyze}
            loading={isLoading}
            leftSection={<IconAnalyze size={16} />}
            variant="filled"
          >
            Analyze
          </Button>
        </Group>

        {result?.error && (
          <Alert
            color="red"
            icon={<IconAlertCircle size={16} />}
            variant="light"
          >
            {getErrorMessage(result.error.code, result.error.error)}
          </Alert>
        )}

        {result?.data && (
          <Alert color="green" icon={<IconCheck size={16} />} variant="light">
            Analysis started! Task ID: {result.data.taskId}
          </Alert>
        )}
      </Stack>
    );
  }

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <div>
          <Text size="lg" fw={600} mb="xs">
            Start Content Analysis
          </Text>
          <Text size="sm" c="dimmed">
            Analyze sentiment from YouTube videos or Reddit posts
          </Text>
        </div>

        <TextInput
          value={url}
          onChange={(event) => setUrl(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading}
          size="md"
        />

        <Button
          onClick={handleAnalyze}
          loading={isLoading}
          leftSection={<IconAnalyze size={20} />}
          size="md"
          fullWidth
        >
          {isLoading ? "Starting Analysis..." : "Start Analysis"}
        </Button>

        {result?.error && (
          <Alert
            color="red"
            icon={<IconAlertCircle size={16} />}
            title="Analysis Failed"
          >
            {getErrorMessage(result.error.code, result.error.error)}
          </Alert>
        )}

        {result?.data && (
          <Alert
            color="green"
            icon={<IconCheck size={16} />}
            title="Analysis Started Successfully"
          >
            <Text size="sm">
              Your analysis has been queued and will begin processing shortly.
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Task ID: {result.data.taskId} • Status: {result.data.status}
            </Text>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
