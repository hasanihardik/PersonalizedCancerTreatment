import { IconChevronRight } from "@tabler/icons-react";
import React from "react";

const MetricsCard = ({ title, subtitle, value, icon: Icon, onClick }) => {
  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm transition-colors duration-200 dark:border-neutral-800 dark:bg-[#13131a]">
      <div className="flex justify-between gap-x-3 p-4 md:p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          <div className="mt-1 flex items-center gap-x-2">
            <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 sm:text-2xl">
              {value}
            </h3>
          </div>
        </div>
        <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24]">
          <Icon className="h-6 w-6 text-white dark:text-[#1ec070]" />
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-[#2c2f32] md:px-5"
        onClick={onClick}
      >
        {subtitle}
        <IconChevronRight className="text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

export { MetricsCard };
