"use client";

import { FC, useActionState } from "react";
import { Button } from "@mantine/core";
import { useFormStatus, useFormState } from "react-dom";
import { integrationMenuAction } from "../actions";
interface ISyncSubmitButtonProps {
  name: string;
}

const initialState = {
  message: "",
};

const SyncSubmitButton: FC<ISyncSubmitButtonProps> = ({ name }) => {
  const [state, formAction] = useFormState(integrationMenuAction, initialState);
  console.log("STATE", state);
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
