"use client";

import { Button } from "@mantine/core";
import { useSmartNavigation } from "@/lib/navigation.utils";
import classes from "./SignInButton.module.css";

export function SignInButton() {
  const { handleNavigation } = useSmartNavigation();

  return (
    <Button 
      variant="filled" 
      className={classes.earlyAccessButton}
      onClick={() => handleNavigation("#early-access", "Early Access")}
    >
      Early Access
    </Button>
  );
}
