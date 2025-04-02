import { IconChevronRight, IconFolder } from "@tabler/icons-react";
import React from "react";

const RecordDetailsHeader = ({ recordName }) => {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      <div className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1c1c24]">
        <div className="flex justify-between gap-x-3 p-4 md:p-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full">
            <IconFolder size={70} className="text-[#1ec070]" />
          </div>
        </div>
        <button
          className="inline-flex cursor-pointer items-center justify-between rounded-b-xl border-t border-neutral-200 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-[#13131a] dark:text-neutral-400 dark:hover:bg-neutral-800 md:px-5"
          type="button"
        >
          {recordName}
        </button>
      </div>
    </div>
  );
};

export default RecordDetailsHeader;
