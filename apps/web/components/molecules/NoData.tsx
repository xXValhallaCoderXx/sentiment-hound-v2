import { FC, ComponentType, SVGProps } from "react";
import Link from "next/link";
import { IconMoodEmpty } from "@tabler/icons-react";
import { Flex, Title, Text, Button } from "@mantine/core";

interface INoDataProps {
  title?: string;
  description?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  redirectCta?: {
    label: string;
    href: string;
  };
}

const NoData: FC<INoDataProps> = ({
  title = "No Data Found",
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon = IconMoodEmpty, // Keep default icon if not provided
  redirectCta,
}) => {
  return (
    <Flex direction="column" align="center" justify="center" gap={8}>
      <IconMoodEmpty size={64} color="gray" opacity={0.3} />
      <Title>{title}</Title>
      <Text mt={-4}>{description}</Text>
      {redirectCta && (
        <Link href={redirectCta.href}>
          <Button>{redirectCta.label}</Button>
        </Link>
      )}
    </Flex>
  );
};

export default NoData;
