"use client";
import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Alert } from "@mantine/core";
import IntegrationCards from "./components/IntegrationCards";
import { Integration, Provider } from "database";

interface IIntegrationsViewProps {
  providers: Provider[];
  integrations: Integration[];
}
const IntegrationsView: FC<IIntegrationsViewProps> = ({
  providers,
  integrations,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleOnCloseAlert = () => {
    router.push("/app/integrations");
  };

  return (
    <div>
      {params.get("success") && (
        <Box mt={10}>
          <Alert
            variant="light"
            color="green"
            title="Integration Success"
            withCloseButton
            onClose={handleOnCloseAlert}
          >
            You have integrateed a new service!
          </Alert>
        </Box>
      )}
      <IntegrationCards providers={providers} integrations={integrations} />
    </div>
  );
};

export default IntegrationsView;
