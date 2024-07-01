import { useState } from "react";
import { IceCream2Icon } from "lucide-react";

import classes from "./side-drawer.module.css";

const data = [
  { link: "", label: "Notifications", icon: IceCream2Icon },
  { link: "", label: "Billing", icon: IceCream2Icon },
  { link: "", label: "Security", icon: IceCream2Icon },
  { link: "", label: "SSH Keys", icon: IceCream2Icon },
  { link: "", label: "Databases", icon: IceCream2Icon },
  { link: "", label: "Authentication", icon: IceCream2Icon },
  { link: "", label: "Other Settings", icon: IceCream2Icon },
];

const SideDrawerNavigation = () => {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IceCream2Icon className={classes.linkIcon} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IceCream2Icon className={classes.linkIcon} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default SideDrawerNavigation;
