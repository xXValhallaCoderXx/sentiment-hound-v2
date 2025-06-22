import { FC } from "react";
import { Title, Box, Text } from "@mantine/core";

interface IPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageLayout: FC<IPageLayoutProps> = ({ title, description, children }) => {
  return (
    <Box
      p={{ base: 8, sm: 16 }}
      id="container"
      style={{
        minHeight: "calc(100vh - 94px)", // Adjust based on your header height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box mb={16}>
        <Title order={2}>{title}</Title>
        {description && <Text fs="italic">{description}</Text>}
      </Box>
      <Box
        id="content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
