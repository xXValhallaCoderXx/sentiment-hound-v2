"use client";
import { useState } from "react";

const DashboardLayout = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex overflow-hidden bg-gray-500 flex-1">
      {/* Side Panel */}
      <div
        className={`bg-gray-200 fixed left-0 top-0 bottom-0 transition-width ease-in-out duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
        style={{ minWidth: isOpen ? "64px" : "16px" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={togglePanel}
        >
          {isOpen ? "Close" : "Open"}
        </button>
        {/* Your side panel content here */}
        {isOpen && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Side Panel</h2>
            {/* Add your side panel content */}
            <ul>
              <li className="mb-2">Link 1</li>
              <li className="mb-2">Link 2</li>
              <li className="mb-2">Link 3</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex-grow overflow-hidden bg-red-500 p-8 transition-margin ease-in-out duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
