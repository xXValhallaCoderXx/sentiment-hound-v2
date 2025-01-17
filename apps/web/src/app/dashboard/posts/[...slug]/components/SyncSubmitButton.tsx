"use client";

import { FC, useEffect, useRef } from "react";
import { Button } from "@mantine/core";
import { useFormStatus, useFormState } from "react-dom";
import { integrationMenuAction } from "../actions";
import { notifications } from "@mantine/notifications";
interface ISyncSubmitButtonProps {
  name: string;
}

const initialState = {
  message: "",
  error: false,
};

const SyncSubmitButton: FC<ISyncSubmitButtonProps> = ({ name }) => {
  const [state, formAction] = useFormState(integrationMenuAction, initialState);

  console.log("STATE: ", state);
  useEffect(() => {
    if (state.error) {
      notifications.show({
        color: "red",
        title: "Error initializng sync",
        message: state?.message,
      });
    } else {
      notifications.show({
        color: "green",
        title: "Sync created",
        message: state?.message,
      });
    }
  }, [state]);
  return (
    <form action={formAction}>
      <SubmitButton />
      <input type="hidden" name="integrationName" value={name} />
      <input type="hidden" name="syncType" value="full" />
    </form>
  );
};

function SubmitButton() {
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
}

export default SyncSubmitButton;
