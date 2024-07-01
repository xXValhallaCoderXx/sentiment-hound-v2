import { useState } from "react";
import Link from "next/link";
import { Button } from "@mantine/core";
import { House, SearchCode, BarChart4 } from "lucide-react";
import { IceCream2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import classes from "./SideDrawer.module.css";

const data = [
  { link: "", label: "Dashboard", icon: House },
  { link: "", label: "Analyse", icon: SearchCode },
  { link: "", label: "Sentiment", icon: BarChart4 },
];

const SideDrawerNavigation = () => {
  // const [active, setActive] = useState("Billing");

  const handleSignout = async () => {
    await signOut();
  };
  const links = data.map((item) => (
    <Link
      className={classes.link}
      // data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      // onClick={(event) => {
      //   event.preventDefault();
      //   setActive(item.label);
      // }}
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
          <IceCream2Icon className={classes.linkIcon} />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default SideDrawerNavigation;
