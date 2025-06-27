'use client';

import { MantineProvider } from '@mantine/core';
import { theme } from '../lib/theme';

export function MantineThemeProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
