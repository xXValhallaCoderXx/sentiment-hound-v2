import { FC } from "react";
import { Title, Box, Text } from "@mantine/core";

interface IPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageLayout: FC<IPageLayoutProps> = ({ title, description, children }) => {
  return (
    <Box className="px-4">
      <Title>{title}</Title>
      {description && <Text>{description}</Text>}
      <Box mt={16}>{children}</Box>
    </Box>
  );
};

export default PageLayout;
