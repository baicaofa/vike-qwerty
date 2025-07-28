import type React from "react";
import { useTranslation } from "react-i18next";

const TypingPracticeButton: React.FC = () => {
  const { t } = useTranslation("common");
  return (
    <div className="relative">
      <a
        href="https://typing.keybr.com.cn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          type="button"
          className="rounded-lg bg-blue-500 text-white font-black px-4 py-2 text-lg transition-all hover:bg-blue-400 hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        >
          👉{t("typing")}👈
        </button>
      </a>
    </div>
  );
};

export default TypingPracticeButton;
