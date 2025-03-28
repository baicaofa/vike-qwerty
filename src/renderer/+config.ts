import type { Config } from "vike/types";

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
  },
  hydrationCanBeAborted: true,
  // 添加必要的配置
  passToClient: ["pageProps", "routeParams"],
  // 预渲染设置
  prerender: true,
} satisfies Config;
