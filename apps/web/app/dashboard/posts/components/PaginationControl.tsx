"use client";

import React from "react";
import { Pagination } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    // Preserve existing query parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update page parameter
    params.set("page", newPage.toString());

    // Navigate to the new URL with updated page
    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination
      total={totalPages}
      value={currentPage}
      onChange={handlePageChange}
    />
  );
};

export default PaginationControl;
