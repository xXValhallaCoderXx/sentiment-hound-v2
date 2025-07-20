"use client";

import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  getInvitationTokenFromStorage,
  clearInvitationTokenFromStorage,
} from "@/lib/invitation-code.utils";

export function InvitationCodeHandler() {
  useEffect(() => {
    const handlePendingInvitationCode = async () => {
      const pendingCode = getInvitationTokenFromStorage();

      if (pendingCode) {
        try {
          const response = await fetch("/api/invitation-codes/apply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invitationCode: pendingCode }),
          });

          const result = await response.json();

          if (response.ok) {
            notifications.show({
              title: "Invitation code applied!",
              message:
                "You've been upgraded to the Developer Plan. Welcome to the beta!",
              color: "green",
            });
          } else {
            notifications.show({
              title: "Invitation code error",
              message: result.error || "Failed to apply invitation code",
              color: "red",
            });
          }
        } catch (error) {
          console.error("Error applying invitation code:", error);
          notifications.show({
            title: "Error",
            message: "Failed to apply invitation code",
            color: "red",
          });
        } finally {
          // Clear the code from storage regardless of success/failure
          clearInvitationTokenFromStorage();
        }
      }
    };

    // Run after a short delay to ensure the user is properly authenticated
    const timer = setTimeout(handlePendingInvitationCode, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
