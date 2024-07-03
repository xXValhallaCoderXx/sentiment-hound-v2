"use client";

import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SideDrawerNavigation } from "../organisms/SideDrawerNavigation";
import { AuthenticatedNavigationMenu } from "../organisms/AuthenticatedNavigationMenu";

const DashboardLayout = ({ children }: any) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 245, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <AuthenticatedNavigationMenu isOpen={opened} onToggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <SideDrawerNavigation />
      </AppShell.Navbar>
      <AppShell.Main className="h-[1px]">{children}</AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
