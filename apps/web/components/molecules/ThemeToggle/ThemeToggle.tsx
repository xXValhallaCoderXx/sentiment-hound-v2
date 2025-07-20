"use client";
import { useEffect, useState } from "react";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon, IconCircleDotted } from "@tabler/icons-react";

export function ThemeToggle() {
  // Hook to control color scheme changes
  const { setColorScheme } = useMantineColorScheme();

  // Hook to get the currently computed color scheme,
  // 'get: true' makes it read from localStorage first, then system preference.
  // This value will be 'light' on server (since no localStorage), then 'dark' (if saved) on client.
  const computedColorScheme = useComputedColorScheme("light");

  // State to track if the component has mounted on the client
  const [mounted, setMounted] = useState(false);

  // useEffect runs only on the client after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ActionIcon variant="default" size="lg" aria-label="Loading theme toggle">
        <IconCircleDotted
          style={{ width: "70%", height: "70%" }}
          stroke={1.5}
        />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === "light" ? (
        <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
      ) : (
        <IconMoon style={{ width: "70%", height: "70%" }} stroke={1.5} />
      )}
    </ActionIcon>
  );
}
