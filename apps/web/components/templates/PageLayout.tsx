import { FC } from "react";
import { Title, Box, Text } from "@mantine/core";

interface IPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageLayout: FC<IPageLayoutProps> = ({ title, description, children }) => {
  return (
    <Box p={{ base: 8, sm: 16 }}>
      <Title order={2}>{title}</Title>
      {description && <Text fs="italic">{description}</Text>}
      <Box mt={16}>{children}</Box>
    </Box>
  );
};

export default PageLayout;
