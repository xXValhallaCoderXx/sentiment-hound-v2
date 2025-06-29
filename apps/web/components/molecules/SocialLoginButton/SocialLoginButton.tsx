"use client";

import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

interface SocialLoginButtonProps {
  provider: "google";
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const providerConfig = {
  google: {
    icon: <IconBrandGoogle size={18} />,
    label: "Continue with Google",
    color: undefined, // Use default button styling
  },
};

export const SocialLoginButton = ({ provider, onClick, loading = false, disabled = false }: SocialLoginButtonProps) => {
  const config = providerConfig[provider];

  return (
    <Button
      variant="outline"
      leftSection={config.icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      fullWidth
      size="md"
    >
      {disabled ? "Continue with Google (Coming Soon)" : config.label}
    </Button>
  );
};

export default SocialLoginButton;
