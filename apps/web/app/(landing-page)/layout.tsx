import { AppShell } from "@mantine/core";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <NavigationMenu />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
