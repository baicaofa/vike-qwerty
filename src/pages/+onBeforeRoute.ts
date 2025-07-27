import { modifyUrl } from "vike/modifyUrl";
import type { Url } from "vike/types";

/**
 * 全局路由前置处理钩子
 * 用于提取 URL 中的语言信息并处理多语言路由
 */
export function onBeforeRoute(pageContext: any) {
  const { urlWithoutLocale, locale, pathnameWithoutLocale } = extractLocale(
    pageContext.urlParsed
  );

  return {
    pageContext: {
      // 将语言信息添加到 pageContext 中，供所有组件使用
      locale,
      // Vike 路由器将使用 urlLogical 而不是 urlOriginal
      // 这样可以移除语言前缀，让路由系统处理干净的路径
      urlLogical: pathnameWithoutLocale,
    },
  };
}

/**
 * 从 URL 中提取语言信息
 * @param url - 解析后的 URL 对象
 * @returns 包含语言代码和移除语言前缀后的 URL
 */
function extractLocale(url: Url) {
  const { pathname } = url;

  // 支持的语言列表
  const supportedLocales = ["zh", "en"] as const;
  const defaultLocale = "zh";

  // 解析路径段
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  let locale = defaultLocale;
  let pathnameWithoutLocale = pathname;

  // 检查第一个路径段是否为支持的语言代码
  if (supportedLocales.includes(firstSegment as any)) {
    locale = firstSegment;
    // 移除语言前缀，重构路径
    pathnameWithoutLocale = "/" + pathSegments.slice(1).join("/");

    // 确保路径以 / 开头，如果移除语言后为空则设为根路径
    if (pathnameWithoutLocale === "/") {
      pathnameWithoutLocale = "/";
    }
  }

  // 重构完整的 URL，移除语言前缀
  const urlWithoutLocale = modifyUrl(url.href, {
    pathname: pathnameWithoutLocale,
  });

  return {
    locale,
    urlWithoutLocale,
    pathnameWithoutLocale,
  };
}
