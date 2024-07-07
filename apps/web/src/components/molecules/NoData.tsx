import { FC } from "react";
import { Box, Title, Text } from "@mantine/core";

interface INoDataProps {
  title?: string;
  description?: string;
  icon?: any;
}

const NoData: FC<INoDataProps> = ({
  title = "No Data Found",
  description,
  icon,
}) => {
  return (
    <Box className=" flex flex-col items-center justify-center gap-2">
      {icon}
      <Title>{title}</Title>
      <Text>{description}</Text>
    </Box>
  );
};

export default NoData;
