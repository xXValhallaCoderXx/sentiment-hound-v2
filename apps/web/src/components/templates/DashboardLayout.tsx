"use client";

import { AppShell, Burger, Skeleton, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { SideDrawerNavigation } from "../organisms/SideDrawerNavigation";

const DashboardLayout = ({ children }: any) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 245, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image
            src="/images/logos/main-logo.png"
            alt=""
            height={45}
            width={45}
          />
          <div className="flex gap-3 items-center -ml-2">
            <Title order={3}>
              <span className="font-extrabold">Sentiment</span>{" "}
              <span className="font-normal">Hound</span>
            </Title>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <SideDrawerNavigation />
      </AppShell.Navbar>
      <AppShell.Main className="h-[1px]">{children}</AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
