"use client";
import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";
interface IIntegrationButtonProps {
  isConnected: boolean;
}

const IntegrationButton: FC<IIntegrationButtonProps> = ({ isConnected }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
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
