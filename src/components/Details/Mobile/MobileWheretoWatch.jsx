import React from "react";

const MobileWheretoWatch = () => {
  return (
    <div className="md:hidden mt-4">
      <button className="w-full flex items-center justify-between bg-gray-800 p-3 rounded mb-2">
        <h3 className="font-medium">WHERE TO WATCH</h3>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default MobileWheretoWatch;
