import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { SharedNavigationMenu } from "@/components/organisms/SharedNavigationMenu";
import { Button } from "@mantine/core";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShellHeader>
        <SharedNavigationMenu 
          links={[{ href: "/", label: "Home" }, { href: "/pricing", label: "Pricing" }]}
          ctaButton={<Button variant="outline" size="sm">Join Early Access</Button>}
        />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
