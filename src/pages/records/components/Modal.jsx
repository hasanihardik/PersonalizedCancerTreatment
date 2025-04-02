import React from "react";
import { IconProgress, IconX } from "@tabler/icons-react";

const Modal = ({
  title,
  children,
  isOpen,
  onClose,
  onAction,
  actionLabel,
  error,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed left-0 top-0 z-[80] flex h-full w-full items-center justify-center bg-[#13131a] bg-opacity-90 dark:bg-opacity-80">
      <div className="relative w-11/12 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1c1c24] md:w-1/2 lg:w-1/3">
        <div className="p-4 sm:p-7">
          {/* Modal Title */}
          <div className="text-center">
            <h2 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">
              {title}
            </h2>
          </div>

          {error && !loading && (
            <div className="mt-4 text-center text-red-600">{error}</div>
          )}

          {/* Modal Content */}
          <div className="mt-5">{children}</div>

          {/* Action Button */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onAction}
              disabled={loading} // Disable button while loading
              className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-[#1ec070] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1dc060] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <IconProgress
                  size={10}
                  className="mr-3 h-5 w-5 animate-spin text-black dark:text-white"
                />
              ) : (
                actionLabel
              )}
            </button>
          </div>
        </div>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-800 hover:text-gray-600 dark:text-neutral-200 dark:hover:text-neutral-400"
        >
          <IconX />
        </button>
      </div>
    </div>
  );
};

export default Modal;
