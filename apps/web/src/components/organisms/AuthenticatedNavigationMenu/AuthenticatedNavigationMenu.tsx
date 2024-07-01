import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
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
        <Link href="/app/dashboard" passHref>
          <div
            id="logo"
            className="shrink-0 mr-4 flex flex-row items-center gap-2"
          >
            <Image
              src="/images/logos/main-logo.png"
              alt=""
              height={50}
              width={50}
              className="mx-auto"
            />
            <h5>
              <span className="font-bold text-lg text-primary">Sentiment</span>{" "}
              Hound
            </h5>
          </div>
        </Link>
        <nav className={`space-x-4 ${isOpen ? " mr-64" : " mr-16"}`}>
          <ProfileDropdown />
        </nav>
      </div>
    </header>
  );
};

export default AuthenticatedNavigationMenu;
