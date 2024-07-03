import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@mantine/core";
import { House, SearchCode, Settings, Contact, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import classes from "./SideDrawer.module.css";

const data = [
  { link: "/dashboard", label: "Dashboard", icon: House },
  { link: "/dashboard/analyse", label: "Analyse", icon: SearchCode },
  { link: "/dashboard/integrations", label: "Integrations", icon: SearchCode },
  { link: "/dashboard/settings", label: "Settings", icon: Settings },
  { link: "/dashboard/profile", label: "Profile", icon: Contact },
];

const SideDrawerNavigation = () => {
  const path = usePathname();

  const handleSignout = async () => {
    await signOut();
  };

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.link === path || undefined}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
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
