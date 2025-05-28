"use client";
import { FC, useTransition, useState } from "react";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // useTransition for showing a pending state if needed
  const [isPending, startTransition] = useTransition();

  const handleOnClick = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const message = await addUserToPlan({ planId });

        notifications.show({
          title: "Default notification",
          message: "Do not forget to star Mantine on GitHub! 🌟",
        });
      } catch (error: any) {
        setErrorMessage(error.message || "Something went wrong.");
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
