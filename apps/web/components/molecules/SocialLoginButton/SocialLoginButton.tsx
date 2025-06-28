"use client";

import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

interface SocialLoginButtonProps {
  provider: "google";
  onClick: () => void;
  loading?: boolean;
}

const providerConfig = {
  google: {
    icon: <IconBrandGoogle size={18} />,
    label: "Continue with Google",
    color: undefined, // Use default button styling
  },
};

export const SocialLoginButton = ({ provider, onClick, loading = false }: SocialLoginButtonProps) => {
  const config = providerConfig[provider];

  return (
    <Button
      variant="outline"
      leftSection={config.icon}
      onClick={onClick}
      loading={loading}
      fullWidth
      size="md"
    >
      {config.label}
    </Button>
  );
};

export default SocialLoginButton;
