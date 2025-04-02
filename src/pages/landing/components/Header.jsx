import React from "react";
import { Button } from "../../../components/ui/button";
import { IconHeartHandshake } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import UserMenu from "../../../components/UserMenu";
import ThemeSwitch from "@/components/ThemeSwitch";
import { LogInIcon } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  return (
    <nav className="mx-auto flex items-center justify-between border-b-2 px-4 py-2 shadow-md">
      <Link to={"/"} className="flex items-center space-x-3">
        <IconHeartHandshake size={40} color="#1ec070" />
        <span className="text-2xl font-semibold hidden sm:flex text-[#1ec070] dark:text-[#1dc070]">
          Cancure AI
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeSwitch className="m-2 flex h-10 w-10 items-center justify-center rounded-full" />

        <Link to={"/dashboard"}>
          <Button className="mr-2 flex items-center gap-2">
            <img src="/apps.svg" alt="dashboard-logo" className="h-6 w-6" />
            <span className="hidden text-base font-medium sm:flex">
              Dashboard
            </span>
          </Button>
        </Link>
        <SignedOut>
          <Button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2"
          >
            <LogInIcon className="text-[#1ec070] sm:hidden" size={24} />
            <LogInIcon
              className="mr-2 hidden text-[#1ec070] sm:flex"
              size={24}
            />
            <span className="hidden text-base font-medium sm:flex">Login</span>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;
