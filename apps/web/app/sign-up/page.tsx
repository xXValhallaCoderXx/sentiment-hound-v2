import { permanentRedirect } from "next/navigation";

// Import the client component
import SignUpForm from "./SignUpForm";

// Use the correct type for Next.js App Router pages
interface SignUpPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // Server-side token/code check
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token || resolvedSearchParams.code;

  // Redirect if token/code is missing or empty
  if (!token || token === "") {
    // Use HTTP 308 (Permanent Redirect) to redirect to sign-in page
    permanentRedirect("/sign-in");
  }

  // If token/code exists, render the sign-up form
  return <SignUpForm />;
}
