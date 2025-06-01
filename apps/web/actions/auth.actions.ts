"use server";

import { signIn } from "@/lib/next-auth.lib";

export async function handleGoogleSignIn() {
  await signIn("google");
}
