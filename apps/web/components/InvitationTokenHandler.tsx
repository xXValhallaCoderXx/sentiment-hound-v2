"use client";

import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  getInvitationTokenFromStorage,
  clearInvitationTokenFromStorage,
} from "@/lib/invitation-token.utils";

export function InvitationTokenHandler() {
  useEffect(() => {
    const handlePendingInvitationToken = async () => {
      const pendingToken = getInvitationTokenFromStorage();

      if (pendingToken) {
        try {
          const response = await fetch("/api/invitation-codes/apply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invitationToken: pendingToken }),
          });

          const result = await response.json();

          if (response.ok) {
            notifications.show({
              title: "Invitation applied!",
              message:
                "You've been upgraded to the Developer Plan. Welcome to the beta!",
              color: "green",
            });
          } else {
            notifications.show({
              title: "Invitation error",
              message: result.error || "Failed to apply invitation token",
              color: "red",
            });
          }
        } catch (error) {
          console.error("Error applying invitation token:", error);
          notifications.show({
            title: "Error",
            message: "Failed to apply invitation token",
            color: "red",
          });
        } finally {
          // Clear the token from storage regardless of success/failure
          clearInvitationTokenFromStorage();
        }
      }
    };

    // Run after a short delay to ensure the user is properly authenticated
    const timer = setTimeout(handlePendingInvitationToken, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
