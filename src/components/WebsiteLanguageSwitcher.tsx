import {
  type SupportedLanguage,
  languageNames,
  supportedLanguages,
} from "@/store/languageAtom";
import { Globe } from "lucide-react";
import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

interface WebsiteLanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * 网站语言切换组件
 * 用于切换网站的显示语言，通过 URL 路径实现多语言支持
 */
export function WebsiteLanguageSwitcher({
  className = "",
  showLabel = true,
}: WebsiteLanguageSwitcherProps) {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState(false);

  // 从 pageContext 获取当前语言和路径信息，添加安全检查
  const currentLocale = (pageContext as any)?.locale || "zh";
  const currentPath = (pageContext as any)?.urlParsed?.pathname || "/";

  // 服务端渲染时的安全检查
  if (typeof window === "undefined" && !(pageContext as any)?.locale) {
    // 服务端渲染时如果没有 locale 信息，返回简化版本
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg"
          disabled
        >
          <Globe size={16} />
          {showLabel && <span>中文</span>}
        </button>
      </div>
    );
  }

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (newLanguage === currentLocale) {
      setIsOpen(false);
      return;
    }

    // 构建新的路径
    let newPath = currentPath;
    if (newLanguage !== "zh") {
      // 非默认语言，添加语言前缀
      newPath = `/${newLanguage}${currentPath}`;
    }

    // 使用原生导航进行页面跳转，触发完整的页面重新加载
    // 这样可以确保 onBeforeRoute 钩子正确处理新的语言路径
    window.location.href = newPath;
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="切换网站语言"
      >
        <Globe size={16} />
        {showLabel && (
          <span>
            {languageNames[currentLocale as SupportedLanguage] ||
              languageNames.zh}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {supportedLanguages.map((language) => (
                <button
                  type="button"
                  key={language}
                  onClick={() => handleLanguageChange(language)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLocale === language
                      ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{languageNames[language]}</span>
                    {currentLocale === language && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 简化版网站语言切换组件（只显示图标和当前语言）
 */
export function WebsiteLanguageSwitcherCompact({
  className = "",
}: {
  className?: string;
}) {
  const pageContext = usePageContext();
  const currentLocale = (pageContext as any)?.locale || "zh";
  const currentPath = (pageContext as any)?.urlParsed?.pathname || "/";

  // 服务端渲染时的安全检查
  if (typeof window === "undefined" && !(pageContext as any)?.locale) {
    return (
      <button
        type="button"
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg
          bg-gray-100 dark:bg-gray-800
          text-gray-600 dark:text-gray-400
          transition-all duration-200 ${className}
        `}
        disabled
        aria-label="切换网站语言"
      >
        <div className="flex flex-col items-center">
          <Globe size={14} />
          <span className="text-xs font-medium mt-0.5">ZH</span>
        </div>
      </button>
    );
  }

  const handleToggleLanguage = () => {
    // 在支持的语言之间循环切换
    const currentIndex = supportedLanguages.indexOf(
      currentLocale as SupportedLanguage
    );
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const nextLanguage = supportedLanguages[nextIndex];

    // 构建新的路径
    let newPath = currentPath;
    if (nextLanguage !== "zh") {
      newPath = `/${nextLanguage}${currentPath}`;
    }

    window.location.href = newPath;
  };

  return (
    <button
      type="button"
      onClick={handleToggleLanguage}
      className={`
        flex items-center justify-center w-10 h-10 rounded-lg
        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
        transition-all duration-200 ${className}
      `}
      title={`切换到 ${
        languageNames[
          supportedLanguages[
            (supportedLanguages.indexOf(currentLocale as SupportedLanguage) +
              1) %
              supportedLanguages.length
          ]
        ]
      }`}
      aria-label="切换网站语言"
    >
      <div className="flex flex-col items-center">
        <Globe size={14} />
        <span className="text-xs font-medium mt-0.5">
          {(currentLocale as string).toUpperCase()}
        </span>
      </div>
    </button>
  );
}

/**
 * 获取当前页面的多语言链接
 * @param currentPath - 当前路径
 * @param currentLocale - 当前语言
 * @returns 多语言链接对象
 */
export function getMultiLanguageLinks(
  currentPath: string,
  currentLocale: SupportedLanguage
) {
  const links: Record<SupportedLanguage, string> = {} as Record<
    SupportedLanguage,
    string
  >;

  supportedLanguages.forEach((language) => {
    if (language === "zh") {
      links[language] = currentPath;
    } else {
      links[language] = `/${language}${currentPath}`;
    }
  });

  return links;
}
