import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f5f5] dark:bg-[#13131a]">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Primary Spinner */}
          <div className="h-16 w-16 animate-spin rounded-full border-8 border-solid border-[#1dc071] border-t-transparent"></div>
          {/* Background Ring */}
          <div className="absolute h-16 w-16 rounded-full border-8 border-solid border-[#e3e3db] opacity-25 dark:border-neutral-600"></div>
        </div>
        {/* Loading Text */}
        <span className="mt-4 text-center text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          We're assessing your medical history for optimal care...
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
