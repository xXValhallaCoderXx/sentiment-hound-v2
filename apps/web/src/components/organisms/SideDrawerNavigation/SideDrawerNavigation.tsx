import { FC } from "react";

interface ISideDrawerNavigationProps {
  isOpen?: boolean;
  togglePanel?: () => void;
}

const SideDrawerNavigation: FC<ISideDrawerNavigationProps> = ({
  isOpen,
  togglePanel,
}) => {
  return (
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
  );
};

export default SideDrawerNavigation;
