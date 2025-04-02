import React from "react";

const Icon = ({ style, name, link, imageUrl, activeSection, handleClick }) => {
  return (
    <div
      className={`h-[48px] w-[48px] rounded-[10px] ${activeSection && activeSection === link && "bg-[#e0e0e0] dark:bg-[#2c2f32]"} flex items-center justify-center ${style}`}
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={`${name} logo`}
        className={`h-6 w-6 ${activeSection !== link && "grayscale"}`}
      />
    </div>
  );
};

export default Icon;
