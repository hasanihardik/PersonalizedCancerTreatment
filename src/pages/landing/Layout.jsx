import React from "react";
import Header from "./components/Header";
import Home from ".";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-[#0D1117] dark:to-[#161C22]">
      <Header />
      <Home />
      {/* footer */}
      <footer className="bg-green-100 py-8 dark:bg-[#0D1117]">
        <div className="container mx-auto px-4 text-center text-black dark:text-white">
          <p>Made with ❤️ by Vinay Chhabra</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
