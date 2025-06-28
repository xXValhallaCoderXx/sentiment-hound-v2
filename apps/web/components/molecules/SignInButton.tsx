"use client";

import { Button } from "@mantine/core";
import { useState } from "react";
import { AuthModal } from "@/components/organisms/AuthModal";

export function SignInButton() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button variant="filled" onClick={() => setOpened(true)}>
        Early Access
      </Button>
      <AuthModal opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
