import { FeedbackDialog } from "../FeedbackDialog";
import type React from "react";
import { usePageContext } from "vike-react/usePageContext";

const Footer: React.FC = () => {
  const pageContext = usePageContext();
  const isHomePage =
    pageContext?.urlPathname === "/" ||
    pageContext?.urlPathname === "/zh" ||
    pageContext?.urlPathname === "/en";

  return (
    <>
      <footer
        className="mb-1 mt-4 flex w-full items-center justify-center gap-2.5 text-sm ease-in"
        onClick={(e) => e.currentTarget.blur()}
      >
        <a
          href="https://www.keybr.com.cn/keybr/"
          target="_blank"
          aria-label=""
          rel="noreferrer noopener"
        >
          Keybr Blog
        </a>
        {isHomePage && (
          <a
            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noreferrer noopener"
          >
            赣ICP备2020012444号
          </a>
        )}

        <FeedbackDialog buttonClassName="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
      </footer>
    </>
  );
};

export default Footer;
