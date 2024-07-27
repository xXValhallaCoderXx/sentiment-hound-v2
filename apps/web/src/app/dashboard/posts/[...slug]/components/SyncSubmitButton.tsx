"use client";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";

const SyncSubmitButton: FC = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      color="blue"
      fullWidth
      loading={pending}
    >
      Start Full Sync
    </Button>
  );
};

export default SyncSubmitButton;
