import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Sentiment Hound",
  description: "Sign in to your Sentiment Hound account to access powerful social media sentiment analysis tools.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
