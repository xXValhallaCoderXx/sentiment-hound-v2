import { FC } from "react";
import { Burger, Group, Title } from "@mantine/core";
import Image from "next/image";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
interface IAuthenticatedNavigationMenuProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const AuthenticatedNavigationMenu: FC<IAuthenticatedNavigationMenuProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={isOpen} onClick={onToggle} hiddenFrom="sm" size="sm" />
        <Image src="/images/logos/main-logo.png" alt="" height={45} width={45} />
        <div className="flex gap-3 items-center -ml-2">
          <Title order={3}>
            <span className="font-extrabold">Sentiment</span>{" "}
            <span className="font-normal">Hound</span>
          </Title>
        </div>
      </Group>
      <ThemeToggle />
    </Group>
  );
};

export default AuthenticatedNavigationMenu;
