// Utility functions for handling invitation tokens
export function getInvitationTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
}

export function setInvitationTokenInStorage(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("pendingInvitationToken", token);
}

export function getInvitationTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("pendingInvitationToken");
}

export function clearInvitationTokenFromStorage(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("pendingInvitationToken");
}

export function validateInvitationTokenFormat(token: string): boolean {
  if (!token || token.trim() === "") return false;

  // Tokens should be at least 16 characters long
  return token.trim().length >= 16;
}
