"use client";

import React, { useState } from "react";
import { Group, Select, Button } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

const Filters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract current filter values from query parameters
  const [providerId, setProviderId] = useState(
    searchParams.get("providerId") || ""
  );
  const [sentiment, setSentiment] = useState(
    searchParams.get("sentiment") || ""
  );
  const [aspect, setAspect] = useState(searchParams.get("aspect") || "");

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (providerId) params.set("providerId", providerId);
    if (sentiment) params.set("sentiment", sentiment);
    if (aspect) params.set("aspect", aspect);

    router.push(`/dashboard/comments?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setProviderId("");
    setSentiment("");
    setAspect("");
    router.push(`/dashboard/comments`);
  };

  const onChangeProvider = (value: string | null) => {
    setProviderId(value || "");
  };

  const onChangeSentiment = (value: string | null) => {
    setSentiment(value || "");
  };

  const onChangeAspect = (value: string | null) => {
    setAspect(value || "");
  };

  return (
    <Group mb="lg" gap="sm">
      <Select
        label="Provider"
        placeholder="Select provider"
        data={[
          { value: "1", label: "Facebook" },
          { value: "2", label: "Twitter" },
          { value: "3", label: "Instagram" },
        ]}
        value={providerId}
        onChange={onChangeProvider}
      />
      <Select
        label="Sentiment"
        placeholder="Select sentiment"
        data={[
          { value: "POSITIVE", label: "Positive" },
          { value: "NEGATIVE", label: "Negative" },
          { value: "NEUTRAL", label: "Neutral" },
        ]}
        value={sentiment}
        onChange={onChangeSentiment}
      />
      <Select
        label="Aspect"
        placeholder="Select aspect"
        data={[
          { value: "usability", label: "Usability" },
          { value: "design", label: "Design" },
          { value: "performance", label: "Performance" },
        ]}
        value={aspect}
        onChange={onChangeAspect}
      />
      <Button onClick={handleApplyFilters}>Apply Filters</Button>
      <Button variant="outline" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </Group>
  );
};

export default Filters;
