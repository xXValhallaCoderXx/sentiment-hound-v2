"use client";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";
interface IIntegrationButtonProps {
  isConnected: boolean;
  isDisabled?: boolean;
}

const IntegrationButton: FC<IIntegrationButtonProps> = ({
  isConnected,
  isDisabled,
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={isDisabled || pending}
      loading={pending}
      type="submit"
      color={isConnected ? "red" : "blue"}
      fullWidth
      mt="md"
      radius="md"
    >
      {isConnected ? "Disconnect" : "Connect"}
    </Button>
  );
};

export default IntegrationButton;
