"use client";

import {
  Text,
  Container,
  ActionIcon,
  Group,
  rem,
  Anchor,
} from "@mantine/core";
import Image from "next/image";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";
import classes from "./footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <div className={classes.inner}>
          {/* Logo Section */}
          <div className={classes.logo}>
            <Group gap="sm" mb="md">
              <Image
                src="/images/logos/main-logo.png"
                alt=""
                height={40}
                width={40}
              />
              <Text size="lg" fw={700} className={classes.brandName}>
                <Text span fw={700} c="primary.5" component="span">
                  Sentiment
                </Text>{" "}
                Hound
              </Text>
            </Group>
            <Text size="sm" className={classes.brandDescription} ta="center">
              Advanced sentiment analysis made simple and accessible for
              businesses of all sizes
            </Text>
          </div>

          {/* Links Section */}
          <div className={classes.links}>
            <Anchor
              href="#features"
              className={classes.link}
            >
              Features
            </Anchor>
            <Anchor
              href="#how-it-works"
              className={classes.link}
            >
              How It Works
            </Anchor>
            <Anchor
              href="/changelog"
              className={classes.link}
            >
              Changelog
            </Anchor>
          </div>
        </div>

        {/* Bottom Section */}
        <Container className={classes.afterFooter} size="lg">
          <Text className={classes.copyright} size="sm">
            © {currentYear} Sentiment Hound. All rights reserved.
          </Text>

          <Group
            gap={8}
            className={classes.social}
            justify="flex-end"
            wrap="nowrap"
          >
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandTwitter
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandYoutube
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Container>
      </Container>
    </footer>
  );
}

export default Footer;
