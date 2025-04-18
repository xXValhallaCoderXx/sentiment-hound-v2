"use client";

import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Button, TextInput, Flex } from "@mantine/core";
import { addNewTask } from "@/slices/tasks/tasks.actions";
import { useForm } from "@mantine/form";
import { TaskType } from "@repo/db";

const YoutubeUrlForm = ({ integration }: { integration: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const formData = new FormData();
      formData.append("integrationId", integration);
      formData.append("taskType", TaskType.ANALYZE_POST);

      // Add the URL to extraData
      const extraData = JSON.stringify({ url: values.url });
      formData.append("extraData", extraData);

      await addNewTask(formData);
      notifications.show({
        title: "Success",
        message: "YouTube URL submitted successfully!",
        color: "green",
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
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

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Submit
        </Button>
      </Flex>
    </form>
  );
};

export default YoutubeUrlForm;
