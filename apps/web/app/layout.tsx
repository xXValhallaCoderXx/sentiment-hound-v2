import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineThemeProvider } from "../components/MantineThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentiment Hound - Energetic Insight, Approachable Power",
  description:
    "Analyze sentiment with a fresh, modern interface. Sentiment Hound provides powerful insights with an accessible and energetic user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineThemeProvider>
          <Notifications />
          {children}
        </MantineThemeProvider>
      </body>
    </html>
  );
}
