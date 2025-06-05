"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { SideDrawerNavigation } from "../organisms/SideDrawerNavigation";
import { AuthenticatedNavigationMenu } from "../organisms/AuthenticatedNavigationMenu";
import { OnboardingWrapper } from "./OnboardingWrapper";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <OnboardingWrapper>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 245,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShellHeader>
          <AuthenticatedNavigationMenu isOpen={true} onToggle={toggle} />
        </AppShellHeader>
        <AppShellNavbar p="md">
          <SideDrawerNavigation />
        </AppShellNavbar>
        <AppShellMain>
          <Notifications position="top-right" />
          {children}
        </AppShellMain>
      </AppShell>
    </OnboardingWrapper>
  );
};

export default DashboardLayout;
