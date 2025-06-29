import { permanentRedirect } from "next/navigation";

// Import the client component
import SignUpForm from "./SignUpForm";

interface SignUpPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  // Server-side token check
  const token = searchParams.token;
  
  // Redirect if token is missing or empty
  if (!token || token === '') {
    // Use HTTP 308 (Permanent Redirect) to redirect to sign-in page
    permanentRedirect('/sign-in');
  }
  
  // If token exists, render the sign-up form
  return <SignUpForm />;
}