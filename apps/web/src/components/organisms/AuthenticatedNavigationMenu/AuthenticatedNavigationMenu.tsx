import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/molecules/button";
import { signIn } from "@/lib/next-auth.lib";
import { ProfileDropdown } from "@/components/molecules/ProfileDropdown";

interface IAuthenticatedNavigationMenuProps {
  isOpen?: boolean;
}

const AuthenticatedNavigationMenu: FC<IAuthenticatedNavigationMenuProps> = ({
  isOpen,
}) => {
  return (
    <header className="bg-white shadow-md fixed w-full  top-0 z-50 ">
      <div className=" px-6 py-3 flex justify-between items-center  ">
        <div className="shrink-0 mr-4 flex flex-row items-center gap-2">
          <Image
            src="/images/logos/main-logo.png"
            alt=""
            height={50}
            width={50}
            className="mx-auto"
          />
          <h5>
            <span className="font-bold text-primary-500">Sentiment</span> Hound
          </h5>
        </div>
        <nav className={`space-x-4 ${isOpen ? " mr-64" : " mr-16"}`}>
          <ProfileDropdown />
          {/* 
         <Button onClick={() => signIn()}>Sign In</Button> */}
          {/* <a href="#" className="text-gray-800 hover:text-gray-600">
            Home
          </a> */}
          {/* <a href="#" className="text-gray-800 hover:text-gray-600">
            About
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Services
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600">
            Contact
          </a> */}
        </nav>
      </div>
    </header>
  );
};

export default AuthenticatedNavigationMenu;
