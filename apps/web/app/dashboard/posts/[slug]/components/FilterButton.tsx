"use client";

import React, { useState } from "react";
import { Button, Menu, Checkbox } from "@mantine/core";
import { IconFilter, IconChevronDown } from "@tabler/icons-react";

const FilterButton = () => {
  const [opened, setOpened] = useState(false);
  const [filters, setFilters] = useState({
    showPositive: true,
    showNeutral: true,
    showNegative: true,
  });

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      shadow="md"
      width={200}
      position="bottom-end"
    >
      <Menu.Target>
        <Button
          variant="light"
          color="gray"
          rightSection={<IconChevronDown size={16} />}
          leftSection={<IconFilter size={16} />}
        >
          Filter
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Filter by sentiment</Menu.Label>
        <Menu.Item
          closeMenuOnClick={false}
          onClick={() => handleFilterChange("showPositive")}
        >
          <Checkbox
            label="Positive"
            checked={filters.showPositive}
            onChange={() => {}}
            mr={10}
          />
        </Menu.Item>
        <Menu.Item
          closeMenuOnClick={false}
          onClick={() => handleFilterChange("showNeutral")}
        >
          <Checkbox
            label="Neutral"
            checked={filters.showNeutral}
            onChange={() => {}}
            mr={10}
          />
        </Menu.Item>
        <Menu.Item
          closeMenuOnClick={false}
          onClick={() => handleFilterChange("showNegative")}
        >
          <Checkbox
            label="Negative"
            checked={filters.showNegative}
            onChange={() => {}}
            mr={10}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterButton;
