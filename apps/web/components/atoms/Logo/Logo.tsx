"use client";

import { Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  href?: string;
  showText?: boolean;
}

export const Logo = ({ size = 50, className, href, showText = true }: LogoProps) => {
  const logoContent = (
    <Group gap="sm" className={className}>
      <Image
        src="/images/logos/main-logo.png"
        alt="Sentiment Hound Logo"
        height={size}
        width={size}
      />
      {showText && (
        <Text c="dimmed">
          <Text span fw={700} c="primary.5" component="span">
            Sentiment
          </Text>{" "}
          Hound
        </Text>
      )}
    </Group>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', cursor: 'pointer' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
