"use client";

import { usePathname, useRouter } from "next/navigation";
import { Pagination, Select, Text, Flex, Group } from "@mantine/core";
import { TaskStatus, TaskType } from "@repo/db";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  searchParams: {
    status?: TaskStatus;
    type?: TaskType;
  };
}

export default function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  searchParams,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Create URL for pagination
  const createPageURL = (pageNumber: number, size: number) => {
    const params = new URLSearchParams();

    // Add filters if they exist
    if (searchParams.status) {
      params.set("status", searchParams.status);
    }

    if (searchParams.type) {
      params.set("type", searchParams.type);
    }

    // Add pagination params
    params.set("page", pageNumber.toString());
    params.set("pageSize", size.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Flex justify="space-between" align="center" mt="md">
      <Text size="sm" color="dimmed">
        Showing {Math.min(totalItems, 1 + (currentPage - 1) * pageSize)} to{" "}
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
      </Text>

      <Group>
        <Select
          label="Items per page"
          data={["5", "10", "25", "50", "100"]}
          value={pageSize.toString()}
          onChange={(value) => {
            if (value) {
              router.push(createPageURL(1, parseInt(value, 10)));
            }
          }}
          w={100}
        />

        <Pagination
          value={currentPage}
          onChange={(page) => {
            router.push(createPageURL(page, pageSize));
          }}
          total={totalPages}
          boundaries={1}
          siblings={1}
        />
      </Group>
    </Flex>
  );
}
