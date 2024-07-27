import "./globals.css";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} antialiased h-full `}>
        <MantineProvider
          theme={{
            fontFamily: "Inter, sans-serif",
            colors: {
              "ocean-blue": [
                "#7AD1DD",
                "#5FCCDB",
                "#44CADC",
                "#2AC9DE",
                "#1AC2D9",
                "#11B7CD",
                "#09ADC3",
                "#0E99AC",
                "#128797",
                "#147885",
              ],
              "bright-pink": [
                "#F0BBDD",
                "#ED9BCF",
                "#EC7CC3",
                "#ED5DB8",
                "#F13EAF",
                "#F71FA7",
                "#FF00A1",
                "#E00890",
                "#C50E82",
                "#AD1374",
              ],
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
