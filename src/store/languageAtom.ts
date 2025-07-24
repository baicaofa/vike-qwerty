import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 支持的语言列表
export const supportedLanguages = ["zh", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// 语言显示名称映射
export const languageNames: Record<SupportedLanguage, string> = {
  zh: "中文",
  en: "English",
};

// 当前语言状态，持久化存储
export const currentLanguageAtom = atomWithStorage<SupportedLanguage>(
  "currentLanguage",
  "zh" // 默认中文
);

// 语言是否已初始化的状态
export const languageInitializedAtom = atom<boolean>(false);

// 检测浏览器语言的工具函数
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return "zh";

  const browserLang = navigator.language.toLowerCase();

  // 检测中文
  if (browserLang.startsWith("zh")) return "zh";
  // 检测英文
  if (browserLang.startsWith("en")) return "en";

  // 默认返回中文
  return "zh";
};

// 语言切换函数
export const createLanguageSwitcher = (
  setLanguage: (lang: SupportedLanguage) => void
) => {
  return (newLanguage: SupportedLanguage) => {
    if (supportedLanguages.includes(newLanguage)) {
      setLanguage(newLanguage);
      // 更新HTML lang属性
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLanguage === "zh" ? "zh-CN" : "en";
      }
    }
  };
};
