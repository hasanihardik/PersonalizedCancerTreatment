import React from 'react';

const CustomSelect = ({ options, value, onChange, placeholder, disabled }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1dc071] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#1C2126] dark:text-gray-200"
    >
      <option value="" className="dark:bg-[#1C2126] dark:text-gray-300">
        {placeholder}
      </option>
      
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value} 
          className="dark:bg-[#1C2126] dark:text-gray-300"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;