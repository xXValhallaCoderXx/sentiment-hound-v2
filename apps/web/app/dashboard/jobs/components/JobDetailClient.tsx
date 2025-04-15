"use client";

import { Drawer } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode } from "react";

interface IJobDetailDrawerClientProps {
  jobId: string;
  children: ReactNode;
}

const JobDetailDrawerClient: FC<IJobDetailDrawerClientProps> = ({
  jobId,
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("jobId");

    // Navigate without the jobId parameter
    router.push(
      `/dashboard/jobs${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return (
    <Drawer
      opened={Boolean(jobId)}
      position="right"
      onClose={handleClose}
      title="Job Details"
      styles={{
        title: { fontSize: 20 },
      }}
      padding="lg"
      size="md"
    >
      {children}
    </Drawer>
  );
};

export default JobDetailDrawerClient;
