import type { SupportedLanguage } from "@/store/languageAtom";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// 检查i18n是否已经初始化
let isInitialized = false;

// i18n配置
export const initI18n = async (initialLanguage: SupportedLanguage = "zh") => {
  // 避免重复初始化
  if (isInitialized) {
    if (i18n.language !== initialLanguage) {
      await i18n.changeLanguage(initialLanguage);
    }
    return i18n;
  }

  const instance = i18n
    .use(Backend) // 使用http backend加载翻译文件
    .use(initReactI18next); // 绑定react-i18next

  await instance.init({
    lng: initialLanguage, // 初始语言
    fallbackLng: "zh", // 回退语言
    debug: process.env.NODE_ENV === "development", // 开发环境开启调试

    // 命名空间配置
    ns: ["common", "typing", "article", "gallery", "errors", "review"],
    defaultNS: "common",

    // 插值配置
    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },

    // 后端配置
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // 翻译文件路径
      requestOptions: {
        cache: "default", // 启用缓存
      },
    },

    // 支持的语言
    supportedLngs: ["zh", "en"],

    // React配置
    react: {
      useSuspense: false, // 禁用Suspense，避免SSR问题
    },

    // 加载策略
    load: "languageOnly", // 只加载语言，不加载地区变体

    // 预加载
    preload: ["zh", "en"], // 预加载所有支持的语言
  });

  isInitialized = true;
  return instance;
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
