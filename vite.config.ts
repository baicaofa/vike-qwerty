import sitemapPlugin from "./vite-plugin-sitemap";
import react from "@vitejs/plugin-react";
import { promises as fs } from "fs";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { dirname, resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import { fileURLToPath } from "url";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import type { PluginOption } from "vite";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 定义需要包含在sitemap中的重要路由及其优先级
const sitemapRoutes = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/gallery", priority: 0.9, changefreq: "daily" },
  { path: "/analysis", priority: 0.8, changefreq: "weekly" },
  { path: "/error-book", priority: 0.8, changefreq: "weekly" },
  { path: "/mobile", priority: 0.7, changefreq: "monthly" },
  { path: "/friend-links", priority: 0.5, changefreq: "monthly" },
  { path: "/familiar", priority: 0.6, changefreq: "monthly" },
  { path: "/updates", priority: 0.4, changefreq: "monthly" },
  // 用户相关页面不需要添加到sitemap中
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      vike(),
      visualizer() as PluginOption,
      Icons({
        compiler: "jsx",
        jsx: "react",
        customCollections: {
          "my-icons": {
            xiaohongshu: () =>
              fs.readFile("./src/assets/xiaohongshu.svg", "utf-8"),
          },
        },
      }),
      sitemapPlugin({
        baseUrl: "https://www.keybr.com.cn",
        routes: sitemapRoutes,
        autoDetect: true,
        excludePatterns: [
          "/api/",
          "/_",
          "/assets/",
          "/favicon",
          "/manifest",
          "/dicts/",
          "/login",
          "/register",
          "/profile",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
        ],
        changefreq: "daily",
        priority: 0.5,
      }),
    ],
    publicDir: "public",
    server: {
      proxy: {
        "/api/auth": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/api/sync": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/api/db-stats": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/api/feedback/public": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.error("Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log(
                "Proxying specific feedback request:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log(
                "Received specific feedback response:",
                proxyRes.statusCode
              );
            });
          },
        },
        "/api/feedback": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/api/pronunciation": {
          target: "https://dict.youdao.com",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/pronunciation/, "/dictvoice"),
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.error("Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxying request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Received response:", proxyRes.statusCode);
            });
          },
        },
      },
    },
    build: {
      outDir: "build",
      sourcemap: true, // 启用 sourcemap
      minify: false, // 禁用压缩
    },
    esbuild: {
      drop: mode === "development" ? [] : ["debugger"],
    },
    define: {
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
      LATEST_COMMIT_HASH: JSON.stringify("dev"),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    ssr: {
      noExternal: ["@/utils"], // 强制将 utils 作为内部模块
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
