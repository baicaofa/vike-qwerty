import Tooltip from "@/components/Tooltip";
import type React from "react";

const CustomArticleButton: React.FC = () => {
  return (
    <Tooltip content="自定义文章练习">
      <a
        href="/custom-article"
        className="flex h-8 min-w-max cursor-pointer items-center justify-center rounded-md px-1 transition-colors text-blue-500 duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        title="自定义文章练习"
        target="_blank"
        aria-label="自定义文章练习"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </Tooltip>
  );
};

export default CustomArticleButton;
