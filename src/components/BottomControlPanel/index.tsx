import PronunciationSwitcher from "@/pages/Typing/components/PronunciationSwitcher";
import Switcher from "@/pages/Typing/components/Switcher";
import type React from "react";

const BottomControlPanel: React.FC = () => {
  return (
    <div className="my-card flex w-auto content-center items-center justify-center space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 dark:bg-gray-800 mt-4">
      <PronunciationSwitcher />
      <Switcher />
    </div>
  );
};

export default BottomControlPanel;
