import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <NavigationMenu />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
