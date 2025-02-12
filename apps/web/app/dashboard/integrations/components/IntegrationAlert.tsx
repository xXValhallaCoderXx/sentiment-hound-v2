"use client";
import { Alert } from "@mantine/core";

import { useRouter, useSearchParams } from "next/navigation";
const IntegrationAlert = (params: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleOnCloseAlert = () => {
    router.push("/dashboard/integrations");
  };

  return (
    searchParams?.get("success") === "true" && (
      <Alert
        variant="light"
        color="green"
        title="Integration Success"
        withCloseButton
        className="mt-4"
        onClose={handleOnCloseAlert}
      >
        You have integrated a new service!
      </Alert>
    )
  );
};

export default IntegrationAlert;
