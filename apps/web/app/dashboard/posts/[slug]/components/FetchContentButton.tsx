"use client";

import { FC, useEffect } from "react";
import { Button } from "@mantine/core";
import { useFormStatus, useFormState } from "react-dom";
import { IFormState, fetchIntegerationContent } from "../actions";
import { notifications } from "@mantine/notifications";
interface ISyncSubmitButtonProps {
  name: string;
}

// Initial state
const initialState: IFormState = {
  status: "idle",
  message: "",
};

const FetchContentButton: FC<ISyncSubmitButtonProps> = ({ name }) => {
  const [state, formAction] = useFormState(
    fetchIntegerationContent,
    initialState
  );

  useEffect(() => {
    if (state.status === "error") {
      notifications.show({
        color: "red",
        title: "Job Creation Error",
        message: state?.message,
      });
    } else if (state.status === "success") {
      notifications.show({
        color: "green",
        title: "Job created",
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
      color="green"
      fullWidth
      loading={pending}
    >
      Fetch Content
    </Button>
  );
}

export default FetchContentButton;
