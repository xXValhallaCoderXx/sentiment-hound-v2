"use client";

import {
  Card as MantineCard,
  type CardProps as MantineCardProps,
} from "@mantine/core";
import { type ReactNode } from "react";
import classes from "./Card.module.css";

interface CardProps extends MantineCardProps {
  children: ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <MantineCard
    className={`${classes.card} ${className || ""}`}
    padding="xl"
    radius="md"
    withBorder
    {...props}
  >
    {children}
  </MantineCard>
);

export default Card;
