import type { SupportedLanguage } from "@/store/languageAtom";
import React from "react";
import { usePageContext } from "vike-react/usePageContext";

interface LinkProps {
  href: string;
  locale?: SupportedLanguage;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

/**
 * 多语言支持的链接组件
 * 自动根据当前语言或指定语言添加语言前缀
 */
export function Link({ href, locale, children, ...props }: LinkProps) {
  const pageContext = usePageContext();
  const currentLocale = locale ?? (pageContext as any).locale ?? "zh";

  // 构建最终的链接地址
  let finalHref = href;

  // 如果不是默认语言（中文），添加语言前缀
  if (currentLocale !== "zh") {
    // 确保 href 以 / 开头
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    finalHref = `/${currentLocale}${normalizedHref}`;
  }

  return (
    <a href={finalHref} {...props}>
      {children}
    </a>
  );
}

/**
 * 获取本地化的链接地址
 * @param href - 原始链接地址
 * @param locale - 目标语言
 * @returns 本地化后的链接地址
 */
export function getLocalizedHref(
  href: string,
  locale: SupportedLanguage = "zh"
): string {
  if (locale === "zh") {
    return href;
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalizedHref}`;
}

/**
 * 从本地化链接中提取原始路径
 * @param localizedHref - 本地化的链接地址
 * @returns 原始路径和语言代码
 */
export function extractFromLocalizedHref(localizedHref: string): {
  originalHref: string;
  locale: SupportedLanguage;
} {
  const pathSegments = localizedHref.split("/").filter(Boolean);
  const supportedLocales: SupportedLanguage[] = ["zh", "en"];

  if (
    pathSegments.length > 0 &&
    supportedLocales.includes(pathSegments[0] as SupportedLanguage)
  ) {
    return {
      originalHref: "/" + pathSegments.slice(1).join("/"),
      locale: pathSegments[0] as SupportedLanguage,
    };
  }

  return {
    originalHref: localizedHref,
    locale: "zh",
  };
}
