import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Sentiment Hound",
  description: "Create your Sentiment Hound account to access powerful social media sentiment analysis tools.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}