import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("p-3 dark:bg-[#1C2126] dark:text-white", className)}
    classNames={{
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium dark:text-white",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        "dark:hover:bg-gray-700 rounded-md"
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: cn(
        "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400"
      ),
      row: "flex w-full mt-2",
      cell: cn(
        "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100",
        "dark:[&:has([aria-selected])]:bg-gray-800",
        "first:[&:has([aria-selected])]:rounded-l-md",
        "last:[&:has([aria-selected])]:rounded-r-md",
        "focus-within:relative focus-within:z-20"
      ),
      day: cn(
        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        "hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md",
        "dark:text-white"
      ),
      day_selected: cn(
        "bg-blue-600 text-white hover:bg-blue-700",
        "dark:bg-blue-600 dark:hover:bg-blue-700"
      ),
      day_today: "bg-gray-100 dark:bg-gray-800",
      day_outside: "text-gray-500 opacity-50 dark:text-gray-400",
      day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
      day_range_middle: cn(
        "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        "dark:aria-selected:bg-gray-800 dark:aria-selected:text-white"
      ),
      day_hidden: "invisible",
      ...classNames,
    }}
    components={{
      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 dark:text-white" />,
      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 dark:text-white" />,
    }}
    {...props}
  />
);

Calendar.displayName = "Calendar";

export { Calendar };
