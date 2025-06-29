"use client";

import { Button as MantineButton, type ButtonProps } from "@mantine/core";
import { type ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
}

export const Button = ({ children, type, ...props }: CustomButtonProps) => (
  <MantineButton type={type} {...props}>
    {children}
  </MantineButton>
);

export default Button;
