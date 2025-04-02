import React, { useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useThemeContext } from "../context/ThemeContext";

const ThemeSwitch = ({ className }) => {
  const { theme, setTheme } = useThemeContext();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      if (localTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <button
      className={`flex items-center justify-center rounded-full border border-none border-opacity-40 bg-white bg-opacity-80 shadow-2xl hover:scale-[1.15] active:scale-105 dark:bg-[#2c2f32] dark:text-white ${className}`}
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun size={24} /> : <BsMoon size={24} />}
    </button>
  );
};

export default ThemeSwitch;
