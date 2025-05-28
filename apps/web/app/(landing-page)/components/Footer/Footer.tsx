import { Text, Container, ActionIcon, Group, rem } from "@mantine/core";
import { 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandLinkedin,
  IconBrandGithub 
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
    title: "Resources",
    links: [
      { label: "Documentation", link: "#" },
      { label: "Knowledge Base", link: "#" },
      { label: "Blog", link: "#" },
      { label: "Community", link: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", link: "#" },
      { label: "Careers", link: "#" },
      { label: "Contact", link: "#" },
      { label: "Press Kit", link: "#" },
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
          <Text size="sm" fw={500} className={classes.description}>
            Transforming sentiment data into actionable insights
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © {new Date().getFullYear()} Sentiment Hound. All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="blue" variant="subtle" className={classes.socialIcon}>
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
          <ActionIcon size="lg" color="violet" variant="subtle" className={classes.socialIcon}>
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
          <ActionIcon size="lg" color="indigo" variant="subtle" className={classes.socialIcon}>
            <IconBrandLinkedin style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle" className={classes.socialIcon}>
            <IconBrandGithub style={{ width: rem(18), height: rem(18) }} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;

export default Footer;
