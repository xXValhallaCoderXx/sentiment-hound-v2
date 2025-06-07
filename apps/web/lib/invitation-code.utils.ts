// Utility functions for handling invitation codes
export function getInvitationCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
}

export function setInvitationCodeInStorage(code: string): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("pendingInvitationCode", code);
}

export function getInvitationCodeFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem("pendingInvitationCode");
}

export function clearInvitationCodeFromStorage(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("pendingInvitationCode");
}

export function validateInvitationCodeFormat(code: string): boolean {
  if (!code || code.trim() === "") return false;
  
  // Allow alphanumeric codes with hyphens and underscores
  const codePattern = /^[A-Z0-9_-]+$/i;
  return codePattern.test(code.trim());
}