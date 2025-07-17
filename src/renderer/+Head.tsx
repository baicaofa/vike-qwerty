import { getPageTDK } from "../resources/tdk";
import { usePageContext } from "vike-react/usePageContext";

export default function Head() {
  const pageContext = usePageContext();
  const { urlPathname, routeParams } = pageContext;

  // 获取当前页面的TDK
  const tdk = getPageTDK(urlPathname, routeParams);

  return (
    <>
      {/* 基础meta标签 */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#818CF8" />

      {/* TDK */}
      <title>{tdk.title}</title>
      <meta name="description" content={tdk.description} />
      <meta name="keywords" content={tdk.keywords} />

      {/* 图标 */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="source" href="https://www.keybr.com.cn/" />
      <link rel="manifest" href="/manifest.json" />

      {/* 分析脚本 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _hmt = _hmt || []
            ;(function () {
              var hm = document.createElement('script')
              hm.src = 'https://hm.baidu.com/hm.js?cdd4953f827b6f6363dbf772936205a1'
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(hm, s)
            })()
          `,
        }}
      />

      {/* Google Analytics */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8W6SFWEMG1"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || []
            function gtag() {
              dataLayer.push(arguments)
            }
            gtag('js', new Date())
            gtag('config', 'G-8W6SFWEMG1')
          `,
        }}
      />

      {/* Google AdSense */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4796148218742064"
        crossOrigin="anonymous"
      />

      {/* Microsoft Clarity */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />

      {/* GitHub Pages SPA 脚本 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />

      {/* 暗色模式初始化脚本 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (
              ('state' in localStorage && JSON.parse(localStorage.state).darkMode) ||
              (!('state' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
              document.documentElement.classList.add('dark')
            }
          `,
        }}
      />
    </>
  );
}
