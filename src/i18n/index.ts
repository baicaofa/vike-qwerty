import type { SupportedLanguage } from "@/store/languageAtom";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// i18n配置
export const initI18n = (initialLanguage: SupportedLanguage = "zh") => {
  return i18n
    .use(Backend) // 使用http backend加载翻译文件
    .use(initReactI18next) // 绑定react-i18next
    .init({
      lng: initialLanguage, // 初始语言
      fallbackLng: "zh", // 回退语言
      debug: process.env.NODE_ENV === "development", // 开发环境开启调试

      // 命名空间配置
      ns: ["common", "typing", "article", "gallery", "errors"],
      defaultNS: "common",

      // 插值配置
      interpolation: {
        escapeValue: false, // React已经处理了XSS
      },

      // 后端配置
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json", // 翻译文件路径
        addPath: "/locales/{{lng}}/{{ns}}.json",
      },

      // 支持的语言
      supportedLngs: ["zh", "en"],

      // 语言检测配置
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },

      // React配置
      react: {
        useSuspense: false, // 禁用Suspense，避免SSR问题
      },

      // 资源配置
      resources: {
        // 初始资源为空，通过backend动态加载
      },
    });
};

// 获取当前语言的工具函数
export const getCurrentLanguage = (): SupportedLanguage => {
  const lang = i18n.language;
  return lang === "en" ? "en" : "zh";
};

// 切换语言的工具函数
export const changeLanguage = async (
  language: SupportedLanguage
): Promise<void> => {
  await i18n.changeLanguage(language);

  // 更新HTML lang属性
  if (typeof document !== "undefined") {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }
};

export default i18n;
