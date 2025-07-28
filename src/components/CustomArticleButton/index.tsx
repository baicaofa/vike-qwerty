import { Link } from "@/components/Link";
import Tooltip from "@/components/Tooltip";
import type React from "react";
import { useTranslation } from "react-i18next";

interface CustomArticleButtonProps {
  pageContext?: any;
}

const CustomArticleButton: React.FC<CustomArticleButtonProps> = ({
  pageContext,
}) => {
  const { t } = useTranslation("common");

  return (
    <Tooltip content={t("customArticle")}>
      <Link
        href="/custom-article"
        className="flex h-8 min-w-max cursor-pointer items-center justify-center rounded-md px-1 transition-colors text-blue-500 duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        title={t("customArticle")}
        target="_blank"
        aria-label={t("customArticle")}
        pageContext={pageContext}
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        {t("article")}
      </Link>
    </Tooltip>
  );
};

export default CustomArticleButton;
