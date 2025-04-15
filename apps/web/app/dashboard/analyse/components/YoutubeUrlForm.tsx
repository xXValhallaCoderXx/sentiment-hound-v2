"use client";

import { useState } from "react";
import { Button, TextInput, Flex, Text } from "@mantine/core";
import { addNewTask } from "@/slices/tasks/tasks.actions";
import { useForm } from "@mantine/form";
import { Integration, TaskType } from "@repo/db";

const YoutubeUrlForm = ({ integration }: { integration: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      url: "",
      providerId: "1", // Default provider ID for YouTube
      taskType: TaskType.ANALYZE_POST,
    },
    validate: {
      url: (value) =>
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(value)
          ? null
          : "Invalid YouTube URL",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("integrationId", integration);
      formData.append("taskType", TaskType.ANALYZE_POST);

      // Add the URL to extraData
      const extraData = JSON.stringify({ url: values.url });
      formData.append("extraData", extraData);

      await addNewTask(formData);
      setSuccess(true);
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction="column" gap="md">
        <TextInput
          label="YouTube URL"
          placeholder="Enter YouTube URL"
          required
          {...form.getInputProps("url")}
          disabled={isSubmitting}
        />

        {/* Hidden fields */}

        {error && <Text color="red">{error}</Text>}
        {success && (
          <Text color="green">YouTube URL submitted successfully!</Text>
        )}

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Submit
        </Button>
      </Flex>
    </form>
  );
};

export default YoutubeUrlForm;
