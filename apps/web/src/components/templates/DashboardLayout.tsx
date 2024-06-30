"use client";
import { useState } from "react";
import { AuthenticatedNavigationMenu } from "@/components/organisms/AuthenticatedNavigationMenu";
import { SideDrawerNavigation } from "@/components/organisms/SideDrawerNavigation";

const DashboardLayout = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className=" ">
      <SideDrawerNavigation isOpen={isOpen} togglePanel={togglePanel} />
      <div
        className={` transition-margin ease-in-out duration-300 h-screen ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <AuthenticatedNavigationMenu isOpen={isOpen} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
