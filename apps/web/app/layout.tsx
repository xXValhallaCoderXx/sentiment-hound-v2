import type { Metadata } from "next";

import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";


export const metadata: Metadata = {
  title: "Sentiment Hound",
  description: "Sentiment Hound is a tool for analyzing sentiment in text.",
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
      <body>
        <body>
          <MantineProvider>{children}</MantineProvider>
        </body>
      </body>
    </html>
  );
}
