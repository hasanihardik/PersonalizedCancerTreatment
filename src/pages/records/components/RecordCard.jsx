import { IconChevronRight, IconFolder, IconTrash } from "@tabler/icons-react";
import React from "react";

const RecordCard = ({ record, onNavigate, handleDeleteRecord }) => {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1c1c24]">
      <div className="flex items-center justify-between p-4 md:p-5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full">
          <IconFolder size={40} className="text-[#1ec070]" />
        </div>
        <button
          type="button"
          onClick={() => handleDeleteRecord(record.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
          aria-label="Delete Record"
        >
          <IconTrash size={20} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onNavigate(record.recordName)}
        className="inline-flex cursor-pointer items-center justify-between rounded-b-xl border-t border-neutral-200 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-[#13131a] dark:text-neutral-400 dark:hover:bg-neutral-800 md:px-5"
      >
        {record.recordName}
        <IconChevronRight className="text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

export default RecordCard;
