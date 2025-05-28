"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Box, Button, Text } from "@mantine/core";
import {
  IconIceCream,
  IconLayoutDashboard,
  IconListCheck,
  IconChartBarPopular,
  IconArticle,
  IconMessageCircle,
  IconPlugConnected,
  IconUserScan,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import classes from "./SideDrawer.module.css";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  {
    group: "Management",
    items: [
      { href: "/dashboard/jobs", label: "Jobs", icon: IconListCheck },
      {
        href: "/dashboard/analyse",
        label: "Analyse",
        icon: IconChartBarPopular,
      },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/dashboard/posts", label: "Posts", icon: IconArticle },
      {
        href: "/dashboard/comments",
        label: "Comments",
        icon: IconMessageCircle,
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        href: "/dashboard/integrations",
        label: "Integrations",
        icon: IconPlugConnected,
      },
      { href: "/dashboard/profile", label: "Profile", icon: IconUserScan },
    ],
  },
];

const SideDrawerNavigation = () => {
  const path = usePathname();

  const handleSignout = async () => {
    await signOut();
  };

  const renderLinks = () => {
    const links = [];

    for (const link of sidebarLinks) {
      if (link.group) {
        links.push(
          <Box mt={8} key={link.group}>
            <Text size="xs" fw={500}>
              {link.group.toUpperCase()}
            </Text>

            {link.items.map((item, index) => (
              <Link
                style={{ marginTop: index === 0 ? 4 : 0 }}
                className={classes.link}
                data-active={path.includes(item.href) || undefined}
                href={item.href}
                key={item.label}
              >
                <item.icon className={classes.linkIcon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </Box>
        );
      } else {
        links.push(
          <Link
            className={classes.link}
            data-active={link.href === path || undefined}
            href={link.href as string}
            key={link.label}
          >
            {link.icon && <link.icon className={classes.linkIcon} />}

            <span>{link.label}</span>
          </Link>
        );
      }
    }

    return links;
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{renderLinks()}</div>
      <div className={classes.footer}>
        <Button variant="transparent" color="gray" onClick={handleSignout}>
          <IconIceCream className={classes.linkIcon} />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default SideDrawerNavigation;
