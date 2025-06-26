"use client";
import { Text, Title, type TextProps, type TitleProps } from "@mantine/core";
import { type ReactNode } from "react";

export const PageTitle = (props: TitleProps & { children?: ReactNode }) => (
  <Title order={1} fz={{ base: 36, md: 48 }} fw={800} {...props} />
);

export const SectionTitle = (props: TitleProps & { children?: ReactNode }) => (
  <Title order={2} fz={{ base: 28, md: 36 }} fw={700} {...props} />
);

export const CardTitle = (props: TitleProps & { children?: ReactNode }) => (
  <Title order={3} fz={{ base: 20, md: 24 }} fw={600} {...props} />
);

export const BodyText = (props: TextProps & { children?: ReactNode }) => (
  <Text fz={{ base: 16, md: 18 }} {...props} />
);

export const DimmedText = (props: TextProps & { children?: ReactNode }) => (
  <Text c="dimmed" fz={{ base: 14, md: 16 }} {...props} />
);
