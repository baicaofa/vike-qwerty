import { changeLanguage } from "@/i18n";
import {
  currentLanguageAtom,
  languageNames,
  supportedLanguages,
  type SupportedLanguage,
} from "@/store/languageAtom";
import { useAtom } from "jotai";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * 语言切换组件
 * 支持中文和英文切换，无刷新切换体验
 */
export function LanguageSwitcher({
  className = "",
  showLabel = true,
}: LanguageSwitcherProps) {
  const { t } = useTranslation("common");
  const [currentLanguage, setCurrentLanguage] = useAtom(currentLanguageAtom);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    if (newLanguage === currentLanguage) return;

    try {
      // 切换i18next语言
      await changeLanguage(newLanguage);

      // 更新Jotai状态
      setCurrentLanguage(newLanguage);

      // 可选：触发页面重新渲染某些组件
      // 这里可以添加额外的逻辑，比如更新URL、发送分析事件等
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <Globe size={16} />
          <span>{t("language.switch")}</span>
        </div>
      )}

      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {supportedLanguages.map((language) => (
          <button
            key={language}
            onClick={() => handleLanguageChange(language)}
            className={`
              px-3 py-1 text-sm font-medium rounded-md transition-all duration-200
              ${
                currentLanguage === language
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }
            `}
            aria-label={`Switch to ${languageNames[language]}`}
          >
            {languageNames[language]}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * 简化版语言切换组件（只显示图标）
 */
export function LanguageSwitcherCompact({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation("common");
  const [currentLanguage, setCurrentLanguage] = useAtom(currentLanguageAtom);

  const handleToggleLanguage = async () => {
    const newLanguage: SupportedLanguage =
      currentLanguage === "zh" ? "en" : "zh";

    try {
      await changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.error("Failed to toggle language:", error);
    }
  };

  return (
    <button
      onClick={handleToggleLanguage}
      className={`
        flex items-center justify-center w-10 h-10 rounded-lg
        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
        transition-all duration-200 ${className}
      `}
      title={t("language.switch")}
      aria-label={t("language.switch")}
    >
      <Globe size={18} />
    </button>
  );
}
