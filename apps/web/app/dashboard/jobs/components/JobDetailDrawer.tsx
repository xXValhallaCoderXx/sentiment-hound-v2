"use client";
import { useRouter } from "next/navigation";
import { Drawer, Button, Group } from "@mantine/core";
import { revalidatePathAction } from "@/actions/navigation.actions";
import { FC } from "react";

interface IJobDetailDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
}

const JobDetailDrawer: FC<IJobDetailDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    revalidatePathAction("/dashboard/jobs");
    router.push("/dashboard/jobs");
  };

  return (
    <Drawer
      opened={isOpen}
      position="right"
      onClose={handleOnClose}
      title="Register"
      styles={{
        title: { fontSize: 20 },
      }}
      padding="lg"
      size="md"
    >
      Weee
    </Drawer>
  );
};
export default JobDetailDrawer;
