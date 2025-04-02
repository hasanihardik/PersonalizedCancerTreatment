import React, { useEffect, useState } from "react";
import { IconHeartHandshake } from "@tabler/icons-react";
import { navLinks } from "@/lib/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setActiveSection(pathname);
  }, [pathname]);

  const handleNavigation = (item) => {
    setActiveSection(item.link);
    setToggleDrawer(false);
    navigate(item.link);
  };

  return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 sm:flex-row">
      {/* Search bar component */}
      <div className="flex h-[52px] w-full flex-row rounded-[100px] bg-[#e9e9e9] py-2 pl-4 pr-2 dark:bg-[#1c1c24] sm:max-w-[498px] lg:flex-1">
        <input
          type="text"
          placeholder="Search for records"
          className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-[#13131a] placeholder-gray-500 outline-none dark:text-white dark:placeholder:text-[#4b5264]"
        />
        <button className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#1ec070] dark:bg-[#1dc071]">
          <img
            src="/search.svg"
            alt="Search"
            className="h-[15px] w-[15px] object-contain"
          />
        </button>
      </div>

      {/* Authentication button */}
      <div className="mr-2 hidden flex-row justify-end sm:flex">
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>

      {/* Mobile view */}
      <div className="relative flex items-center justify-between sm:hidden">
        <Link to={"/dashboard"}>
          <div className="flex cursor-pointer items-center justify-center rounded-full bg-[#e3e3db] dark:bg-[#2c2f32]">
            <IconHeartHandshake size={50} color="#1ec070" className="p-2" />
          </div>
        </Link>

        <div className="flex items-center">
          <img
            src="/menu.svg"
            alt="Menu"
            className="h-[38px] w-[38px] cursor-pointer object-contain"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />
          <ThemeSwitch className="m-3 flex h-10 w-10 items-center justify-center rounded-full" />
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>

        {/* Toggle menu sidebar */}
        <div
          className={`absolute left-0 right-0 top-[60px] z-10 bg-[#f5f5f5] py-4 shadow-secondary dark:bg-[#13131a] ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navLinks.map((item) => (
              <li
                key={item.name}
                className={`flex cursor-pointer p-4 ${
                  activeSection === item.link
                    ? "bg-[#e3e3db] dark:bg-[#3a3a43]"
                    : ""
                }`}
                onClick={() => handleNavigation(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={`h-[24px] w-[24px] object-contain ${
                    activeSection === item.link ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    activeSection === item.link
                      ? "text-[#1dc071]"
                      : "text-[#808191]"
                  }`}
                >
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
