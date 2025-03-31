"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Group, Select, TextInput, Button } from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

interface FilterParams {
  providerId?: string;
  sentiment?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface PostFilterProps {
  currentFilters: FilterParams;
}

const PostFilter: React.FC<PostFilterProps> = ({ currentFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set up state for filters
  const [providerId, setProviderId] = useState(currentFilters.providerId || "");
  const [sentiment, setSentiment] = useState(currentFilters.sentiment || "");
  const [startDate, setStartDate] = useState<Date | null>(
    currentFilters.startDate ? new Date(currentFilters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    currentFilters.endDate ? new Date(currentFilters.endDate) : null
  );
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || "");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(
    currentFilters.sortOrder || "desc"
  );

  const handleApplyFilters = () => {
    // Create new params from current URL to preserve other parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update filter parameters
    if (providerId) params.set("providerId", providerId);
    else params.delete("providerId");

    if (sentiment) params.set("sentiment", sentiment);
    else params.delete("sentiment");

    // if (startDate)
    //   params.set("startDate", startDate.toISOString().split("T")[0]);
    // else params.delete("startDate");

    // if (endDate) params.set("endDate", endDate.toISOString().split("T")[0]);
    // else params.delete("endDate");

    if (searchTerm) params.set("searchTerm", searchTerm);
    else params.delete("searchTerm");

    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    else params.delete("sortBy");

    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    else params.delete("sortOrder");

    // Reset to page 1 when filters change
    params.set("page", "1");

    // Update URL with new parameters
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setProviderId("");
    setSentiment("");
    setStartDate(null);
    setEndDate(null);
    setSearchTerm("");
    setSortBy("createdAt");
    setSortOrder("desc");

    // Reset URL to default state
    router.push("/dashboard/posts");
  };

  return (
    <Box mb="lg">
      <Group mb="md">
        <TextInput
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1 }}
        />

        <Select
          placeholder="Provider"
          value={providerId}
          onChange={(value) => setProviderId(value || "")}
          data={[
            { value: "1", label: "YouTube" },
            { value: "2", label: "Twitter" },
            { value: "3", label: "Facebook" },
            { value: "4", label: "Instagram" },
          ]}
          clearable
        />

        <Select
          placeholder="Sentiment"
          value={sentiment}
          onChange={(value) => setSentiment(value || "")}
          data={[
            { value: "POSITIVE", label: "Positive" },
            { value: "NEGATIVE", label: "Negative" },
            { value: "NEUTRAL", label: "Neutral" },
          ]}
          clearable
        />
        <Button
          onClick={handleApplyFilters}
          leftSection={<IconFilter size={16} />}
          color="black"
        >
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearFilters} color="black">
          Clear Filters
        </Button>
      </Group>
    </Box>
  );
};

export default PostFilter;

{
  /* <Group mb="md"> */
}
{
  /* <DateInput
  valueFormat="YYYY-MM-DD"
  label="Start Date"
  placeholder="Filter from"
  value={startDate}
  onChange={setStartDate}
  clearable
/> */
}

{
  /* <DateInput
  valueFormat="YYYY-MM-DD"
  label="End Date"
  placeholder="Filter to"
  value={endDate}
  onChange={setEndDate}
  clearable
/> */
}

{
  /* <Select
  label="Sort By"
  placeholder="Sort field"
  value={sortBy}
  onChange={(value) => setSortBy(value || "createdAt")}
  data={[
    { value: "createdAt", label: "Created Date" },
    { value: "publishedAt", label: "Published Date" },
    { value: "title", label: "Title" },
    { value: "commentCount", label: "Comment Count" },
  ]}
/>

<Select
  label="Sort Order"
  placeholder="Sort direction"
  value={sortOrder}
  onChange={(value) => setSortOrder(value || "desc")}
  data={[
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ]}
  leftSection={
    sortOrder === "asc" ? (
      <IconSortAscending size={16} />
    ) : (
      <IconSortDescending size={16} />
    )
  }
/> */
}
{
  /* </Group> */
}