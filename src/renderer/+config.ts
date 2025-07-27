import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,

  // 保持现有的自定义meta配置，与vike-react兼容
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
  passToClient: [
    "pageProps",
    "routeParams",
    "title",
    "data",
    "locale",
    "urlLogical",
  ],
  // 预渲染设置
  prerender: true,

  // 启用vike-react
  extends: [vikeReact],
} satisfies Config;
