import { MantineTheme as MantineThemeBase } from "@mantine/core";

declare module "@mantine/core" {
  export interface MantineTheme extends MantineThemeBase {
    colorScheme: "light" | "dark";
  }
}
