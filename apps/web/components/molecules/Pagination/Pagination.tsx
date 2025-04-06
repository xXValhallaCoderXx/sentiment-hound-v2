"use client";

import React from "react";
import { Group, Button, Text, Flex } from "@mantine/core";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchParams?: Record<string, string | undefined>;
}

const Pagination: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  searchParams = {},
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  // Generate page numbers to show (current page, prev, next, first, last)
  const getVisiblePageNumbers = () => {
    const delta = 1; // How many pages to show before and after current page
    const pages = [];

    // Always include page 1
    pages.push(1);

    // Calculate range around current page
    const leftBound = Math.max(2, currentPage - delta);
    const rightBound = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after page 1 if needed
    if (leftBound > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages around current page
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rightBound < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }

    // Add last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    // Create new URLSearchParams object from current params
    const params = new URLSearchParams(currentSearchParams.toString());

    // Update page parameter
    params.set("page", newPage.toString());

    // Add any additional search params from props
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Navigate to new URL
    router.push(`${pathname}?${params.toString()}`);
  };

  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Flex direction="column" align="center" mt="xl">
      <Group gap="xs">
        {/* Previous page button */}
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          size="sm"
        >
          &laquo; Prev
        </Button>

        {/* Page numbers */}
        {getVisiblePageNumbers().map((page, index) => {
          // Render ellipsis
          if (page < 0) {
            return <Text key={`ellipsis-${index}`}>...</Text>;
          }

          // Render page button
          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "filled" : "outline"}
              onClick={() => handlePageChange(page)}
              size="sm"
            >
              {page}
            </Button>
          );
        })}

        {/* Next page button */}
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          size="sm"
        >
          Next &raquo;
        </Button>
      </Group>

      <Text size="sm" color="dimmed" mt="xs">
        Showing {pageSize * (currentPage - 1) + 1}-
        {Math.min(pageSize * currentPage, totalItems)} of {totalItems} items
      </Text>
    </Flex>
  );
};

export default Pagination;
