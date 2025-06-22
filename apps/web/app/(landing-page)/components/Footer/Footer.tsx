import { Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import classes from "./footer.module.css";

const data = [
  {
    title: "Product",
    links: [
      { label: "Features", link: "#" },
      { label: "Pricing", link: "#" },
      { label: "Use Cases", link: "#" },
      { label: "API", link: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", link: "#" },
      { label: "Blog", link: "#" },
      { label: "Careers", link: "#" },
      { label: "Contact", link: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", link: "#" },
      { label: "Tutorials", link: "#" },
      { label: "Support", link: "#" },
      { label: "Status", link: "#" },
    ],
  },
];

const Footer = () => {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Link key={index} className={classes.link} href={link.link}>
        {link.label}
      </Link>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image
            src="/images/logos/main-logo.png"
            alt="Sentiment Hound Logo"
            height={50}
            width={50}
            className="mx-auto"
          />
          <Text size="md" fw={500} className={classes.description} c="white">
            Sentiment Hound
          </Text>
          <Text size="xs" c="#a0a0a0" className={classes.description}>
            Advanced sentiment analysis made simple and accessible for
            businesses of all sizes
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="#a0a0a0" size="sm">
          © {currentYear} Sentiment Hound. All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="blue" variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
          <ActionIcon size="lg" color="blue" variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
          <ActionIcon size="lg" color="blue" variant="subtle">
            <IconBrandLinkedin style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;
