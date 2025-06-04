"use client";
import { FC, useTransition } from "react";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { addUserToPlan } from "@/actions/plans.action";

interface IPlanSubmitButtonProps {
  isUsersPlan: boolean;
  planId: string;
}

const PlanSubmitButton: FC<IPlanSubmitButtonProps> = ({
  isUsersPlan,
  planId,
}) => {
  // Local UI states to display success/errors

  // useTransition for showing a pending state if needed
  const [isPending, startTransition] = useTransition();

  const handleOnClick = async () => {
    startTransition(async () => {
      try {
        await addUserToPlan({ planId });

        notifications.show({
          title: "Default notification",
          message: "Do not forget to star Mantine on GitHub! 🌟",
        });
      } catch (error: unknown) {
        let errorMessage = "Something went wrong.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        notifications.show({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
      }
    });
  };
  return (
    <Button
      disabled={isUsersPlan}
      onClick={handleOnClick}
      color="blue"
      fullWidth
      mt="md"
      radius="md"
    >
      {isPending ? "Creating ..." : "Create"}
    </Button>
  );
};

export default PlanSubmitButton;
