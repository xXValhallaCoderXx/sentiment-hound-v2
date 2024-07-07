import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, Text } from "@mantine/core";
import {
  House,
  SearchCode,
  StickyNote,
  Contact,
  LogOut,
  Cable,
  MessagesSquare,
  ClipboardCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import classes from "./SideDrawer.module.css";

const sidebarLinks = [
  { link: "/dashboard", label: "Dashboard", icon: House },
  {
    group: "Management",
    items: [
      { link: "/dashboard/jobs", label: "Jobs", icon: ClipboardCheck },
      { link: "/dashboard/analyse", label: "Analyse", icon: SearchCode },
    ],
  },
  {
    group: "Content",
    items: [
      { link: "/dashboard/posts", label: "Posts", icon: StickyNote },
      { link: "/dashboard/comments", label: "Comments", icon: MessagesSquare },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        link: "/dashboard/integrations",
        label: "Integrations",
        icon: Cable,
      },
      { link: "/dashboard/profile", label: "Profile", icon: Contact },
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
          <div key={link.group}>
            <Text size="md">{link.group}</Text>
            <div>
              {link.items.map((item) => (
                <Link
                  className={classes.link}
                  data-active={item.link === path || undefined}
                  href={item.link}
                  key={item.label}
                >
                  <item.icon className={classes.linkIcon} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      } else {
        links.push(
          <Link
            className={classes.link}
            data-active={link.link === path || undefined}
            // href={link.link}
            href="/"
            key={link.label}
          >
            {/* <link.icon className={classes.linkIcon} /> */}

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
          <LogOut className={classes.linkIcon} />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default SideDrawerNavigation;
