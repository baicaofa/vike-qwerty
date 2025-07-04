import type { Config } from "vike/types";

// import vikeReact from "vike-react/config";

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
  },
  hydrationCanBeAborted: true,
  // 添加必要的配置
  passToClient: ["pageProps", "routeParams", "title"],
  // 预渲染设置
  prerender: true,
  // extends: vikeReact,
} satisfies Config;
