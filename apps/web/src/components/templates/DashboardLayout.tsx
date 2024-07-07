"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
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
      <AppShellHeader>
        <AuthenticatedNavigationMenu isOpen={true} onToggle={toggle} />
      </AppShellHeader>
      <AppShellNavbar p="md">
        <SideDrawerNavigation />
      </AppShellNavbar>
      <AppShellMain className="h-[1px]">{children}</AppShellMain>
    </AppShell>
  );
};

export default DashboardLayout;
