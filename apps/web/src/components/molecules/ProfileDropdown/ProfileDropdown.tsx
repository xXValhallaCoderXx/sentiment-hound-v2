"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/molecules/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/molecules/button";
import { UserRound } from "lucide-react";
import { signOut } from "next-auth/react";

interface IProfileDropdownProps {
  image?: string;
}

const ProfileDropdown: FC<IProfileDropdownProps> = ({ image }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex px-2 py-1 border items-center gap-2 cursor-pointer">
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            {image ? (
              <Image
                src={image}
                width={34}
                height={34}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            ) : (
              <UserRound width={34} height={34} />
            )}
          </Button>
          <div>
            <p className="text-sm font-bold">renate.gouveia@gmail.com</p>
            <p className="text-xs">sss</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
