import { changeLanguage, getCurrentLanguage } from "@/i18n";
import {
  currentLanguageAtom,
  languageInitializedAtom,
  type SupportedLanguage,
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
      const i18nLanguage = getCurrentLanguage();
      if (i18nLanguage !== currentLanguage) {
        setCurrentLanguage(i18nLanguage);
      }
      setLanguageInitialized(true);
    };

    // 监听语言变化
    i18n.on("languageChanged", syncLanguage);

    // 初始同步
    syncLanguage();

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, [currentLanguage, setCurrentLanguage, setLanguageInitialized, i18n]);

  // 切换语言函数
  const switchLanguage = useCallback(
    async (newLanguage: SupportedLanguage) => {
      if (newLanguage === currentLanguage) return;

      try {
        await changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);
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
  const { t } = useTranslation(namespace);
  const { currentLanguage, switchLanguage, toggleLanguage } = useI18n();

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
