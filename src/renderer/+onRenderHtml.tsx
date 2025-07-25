import { ToastProvider } from "../hooks/useToast";
import { initI18n } from "../i18n";
import { TypingContext, initialState } from "../pages/Typing/store";
import { getPageTDK } from "../resources/tdk";
import type { SupportedLanguage } from "../store/languageAtom";
import "animate.css";
import { Provider as JotaiProvider, createStore } from "jotai";
import type React from "react";
import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { PageContextServer } from "vike/types";

// https://vike.dev/onRenderHtml
export { onRenderHtml };

// 语言检测函数
function detectLanguageFromContext(
  pageContext: PageContext
): SupportedLanguage {
  // 1. 优先使用 onBeforeRoute 钩子提供的 locale 信息
  if ((pageContext as any).locale) {
    return (pageContext as any).locale as SupportedLanguage;
  }

  // 2. 从URL路径检测（如果有语言前缀）
  const urlPath = pageContext.urlPathname;
  if (urlPath.startsWith("/en/")) return "en";
  if (urlPath.startsWith("/zh/")) return "zh";

  // 3. 从Accept-Language头检测
  const acceptLanguage = pageContext.headers?.["accept-language"];
  if (acceptLanguage) {
    if (acceptLanguage.includes("en")) return "en";
    if (acceptLanguage.includes("zh")) return "zh";
  }

  // 4. 默认返回中文
  return "zh";
}

// 扩展PageContextServer接口
interface PageContext extends PageContextServer {
  Page: React.ComponentType<any>;
  urlPathname: string;
  routeParams: Record<string, string>;
  headers?: Record<string, string>;
  config: {
    Layout?:
      | React.ComponentType<{ children: React.ReactNode }>
      | React.ComponentType<{ children: React.ReactNode }>[];
  };
}

async function onRenderHtml(pageContext: PageContext) {
  const { Page, urlPathname, routeParams, config } = pageContext;
  const { Layout } = config;

  // 检测语言（从URL、Accept-Language头或默认值）
  const detectedLanguage: SupportedLanguage =
    detectLanguageFromContext(pageContext);

  // 初始化i18n
  await initI18n(detectedLanguage);

  // 获取当前页面的TDK
  const tdk = getPageTDK(urlPathname, routeParams);

  // 创建一个空的 dispatch 函数用于服务端渲染
  const typingContextValue = {
    state: initialState,
    dispatch: () => {
      console.warn("Dispatch called during SSR");
    },
  };

  // 创建一个 Jotai store 实例用于服务端渲染
  const store = createStore();

  let pageView = <Page pageContext={pageContext} />;
  if (Layout) {
    if (Array.isArray(Layout)) {
      pageView = Layout.reduceRight(
        (children, L) => <L>{children}</L>,
        pageView
      );
    } else {
      pageView = <Layout>{pageView}</Layout>;
    }
  }

  const pageHtml = dangerouslySkipEscape(
    renderToString(
      <JotaiProvider store={store}>
        <TypingContext.Provider value={typingContextValue}>
          <ToastProvider>{pageView}</ToastProvider>
        </TypingContext.Provider>
      </JotaiProvider>
    )
  );

  // 动态设置语言属性
  const langMap: Record<SupportedLanguage, string> = {
    zh: "zh-CN",
    en: "en",
  };
  const htmlLang = langMap[detectedLanguage] || "zh-CN";

  // 使用escapeInject返回HTML
  return escapeInject`<!DOCTYPE html>
<html lang="${htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <script>
      var _hmt = _hmt || []
      ;(function () {
        var hm = document.createElement('script')
        hm.src = 'https://hm.baidu.com/hm.js?cdd4953f827b6f6363dbf772936205a1'
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
      })()
    </script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8W6SFWEMG1"></script>
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())

      gtag('config', 'G-8W6SFWEMG1')
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4796148218742064"
     crossorigin="anonymous"></script>
    <script type="text/javascript">
      ;(function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            ;(c[a].q = c[a].q || []).push(arguments)
          }
        t = l.createElement(r)
        t.async = 1
        t.src = 'https://www.clarity.ms/tag/' + i
        y = l.getElementsByTagName(r)[0]
        y.parentNode.insertBefore(t, y)
      })(window, document, 'clarity', 'script', 'mnmqpd7al8')
    </script>

    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script checks to see if a redirect is present in the query string,
      // converts it back into the correct url and adds it to the
      // browser's history using window.history.replaceState(...),
      // which won't cause the browser to attempt to load the new url.
      // When the single page app is loaded further down in this file,
      // the correct url will be waiting in the browser's history for
      // the single page app to route accordingly.
      ;(function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search
            .slice(1)
            .split('&')
            .map(function (s) {
              return s.replace(/~and~/g, '&')
            })
            .join('?')
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
        }
      })(window.location)
    </script>

    <title>${dangerouslySkipEscape(tdk.title)}</title>
    <meta
      name="description"
      content="${dangerouslySkipEscape(tdk.description)}"
    />
    <meta name="keywords" content="${dangerouslySkipEscape(tdk.keywords)}" />

    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#818CF8" />
    <link rel="source" href="https://www.keybr.com.cn/" />
    <link rel="manifest" href="/manifest.json" />

    <script>
      // Dark mode init
      if (
        ('state' in localStorage && JSON.parse(localStorage.state).darkMode) ||
        (!('state' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark')
      }
    </script>
  </head>
  <body>
    <noscript>
      <div>You need to enable JavaScript to run Keybr.</div>
      <div>你需要启用 JavaScript 来运行 Keybr。</div>
    </noscript>
    <div id="root">${pageHtml}</div>
  </body>
</html>`;
}
