import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#0D1117] dark:to-[#161C22]">
      <div className="text-center p-8 lg:p-16 bg-white dark:bg-[#1C2126] rounded-xl shadow-lg max-w-md w-full">
        {/* Icon */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto animate-pulse"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl font-extrabold text-green-600 dark:text-green-400 mb-2">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The page you’re looking for doesn’t exist. It may have been removed,
          or it might be temporarily unavailable.
        </p>

        {/* Button to go back to Home */}
        <button
          onClick={() => navigate("/")}
          className="inline-block text-md bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
