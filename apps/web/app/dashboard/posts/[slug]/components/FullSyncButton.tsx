"use client";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";

const FullSyncButton: FC = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      loading={pending}
      type="submit"
      color="blue"
      radius="md"
    >
      Full Sync
    </Button>
  );
};

export default FullSyncButton;
