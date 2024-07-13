import { FC } from "react";
import Link from "next/link";
import { Box, Title, Text, Button } from "@mantine/core";

interface INoDataProps {
  title?: string;
  description?: string;
  icon?: any;
  redirectCta?: {
    label: string;
    href: string;
  };
}

const NoData: FC<INoDataProps> = ({
  title = "No Data Found",
  description,
  icon,
  redirectCta,
}) => {
  return (
    <Box className=" flex flex-col items-center justify-center gap-2">
      {icon}
      <Title>{title}</Title>
      <Text>{description}</Text>
      {redirectCta && (
        <Link href={redirectCta.href}>
          <Button>{redirectCta.label}</Button>
        </Link>
      )}
    </Box>
  );
};

export default NoData;
