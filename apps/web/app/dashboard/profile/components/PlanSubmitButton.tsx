"use client";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";
interface IPlanSubmitButtonProps {
  isUsersPlan: boolean;
}

const PlanSubmitButton: FC<IPlanSubmitButtonProps> = ({ isUsersPlan }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={isUsersPlan}
      type="submit"
      color="blue"
      fullWidth
      mt="md"
      radius="md"
    >
      {pending ? "Creating ..." : "Create"}
    </Button>
  );
};

export default PlanSubmitButton;
