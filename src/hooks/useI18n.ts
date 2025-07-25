import i18n from "@/i18n";
import {
  type SupportedLanguage,
  currentLanguageAtom,
  languageInitializedAtom,
} from "@/store/languageAtom";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * 自定义i18n Hook
 * 提供语言切换、翻译函数等功能
 */
export function useI18n() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useAtom(currentLanguageAtom);
  const setLanguageInitialized = useSetAtom(languageInitializedAtom);

  // 同步i18next语言状态到Jotai
  useEffect(() => {
    const syncLanguage = () => {
      const i18nLanguage = i18n.language === "en" ? "en" : "zh";
      setCurrentLanguage(i18nLanguage);
      setLanguageInitialized(true);
    };

    // 监听语言变化
    i18n.on("languageChanged", syncLanguage);

    // 初始同步
    syncLanguage();

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, [setCurrentLanguage, setLanguageInitialized]); // 移除currentLanguage依赖，避免无限循环

  // 切换语言函数
  const switchLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      if (newLanguage === currentLanguage) return;

      try {
        await i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);

        // 更新HTML lang属性
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLanguage === "zh" ? "zh-CN" : "en";
        }
      } catch (error) {
        console.error("Failed to switch language:", error);
        throw error;
      }
    },
    [currentLanguage, setCurrentLanguage]
  );

  // 切换到下一个语言
  const toggleLanguage = useCallback(async () => {
    const nextLanguage: SupportedLanguage =
      currentLanguage === "zh" ? "en" : "zh";
    await switchLanguage(nextLanguage);
  }, [currentLanguage, switchLanguage]);

  return {
    // 翻译函数
    t,

    // 当前语言
    currentLanguage,

    // 语言切换函数
    switchLanguage,
    toggleLanguage,

    // i18next实例（用于高级用法）
    i18n,
  };
}

/**
 * 命名空间特定的翻译Hook
 */
export function useNamespaceTranslation(namespace: string) {
  const { t, i18n } = useTranslation(namespace);
  const [currentLanguage, setCurrentLanguage] = useAtom(currentLanguageAtom);

  // 简化的语言切换函数，避免重复调用
  const switchLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      if (newLanguage === currentLanguage) return;

      try {
        await i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);

        // 更新HTML lang属性
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLanguage === "zh" ? "zh-CN" : "en";
        }
      } catch (error) {
        console.error("Failed to switch language:", error);
        throw error;
      }
    },
    [currentLanguage, setCurrentLanguage, i18n]
  );

  const toggleLanguage = useCallback(async () => {
    const nextLanguage: SupportedLanguage =
      currentLanguage === "zh" ? "en" : "zh";
    await switchLanguage(nextLanguage);
  }, [currentLanguage, switchLanguage]);

  return {
    t,
    currentLanguage,
    switchLanguage,
    toggleLanguage,
  };
}

/**
 * 多命名空间翻译Hook
 */
export function useMultiNamespaceTranslation(namespaces: string[]) {
  const { t } = useTranslation(namespaces);
  const { currentLanguage, switchLanguage, toggleLanguage } = useI18n();

  return {
    t,
    currentLanguage,
    switchLanguage,
    toggleLanguage,
  };
}
